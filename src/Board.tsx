import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import dynamic from "next/dynamic";
import Card from "./Card";
import ColumnHeader from "./ColumnHeader";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  board: {
    "& > div > div > div ": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.shape.borderRadius
    }
  }
}));

const ReactBoard = dynamic((() => import("@lourenci/react-kanban")) as any, {
  ssr: false
});

async function markAsDone(override_id: number, type = "assignment") {
  await fetch(
    `https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/planner/overrides/${override_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        marked_complete: true
      })
    }
  );
}

async function createDoneOverride(id: number, type = "assignment") {
  await fetch(
    "https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/planner/overrides",
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        plannable_id: id,
        marked_complete: true,
        plannable_type: type
      })
    }
  );
}

async function markAsNotDone(override_id: number) {
  await fetch(
    `https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/planner/overrides/${override_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        marked_complete: false
      })
    }
  );
}

async function createNotDoneOverride(id: number, type = "assignment") {
  await fetch(
    "https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/planner/overrides",
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        plannable_id: id,
        marked_complete: false,
        plannable_type: type
      })
    }
  );
}

async function markAsDoing(ids: number[]) {
  console.log(ids);

  await fetch(
    "https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/users/self/custom_data",
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        ns: "dev.acardosi.canban",
        data: {
          doing: ids
        }
      })
    }
  );
}

interface IProps {
  assignments: any[]; // TODO: Define an interface for this
  colors: IColors;
  doingIds: number[];
}

interface IColors {
  custom_colors: any;
}

export default function Board({ assignments, colors, doingIds }: IProps) {
  const classes = useStyles();
  let todos = [];
  let doings = [];
  let dones = [];

  const initialBoard = {
    columns: [
      {
        id: 1,
        title: "To Do",
        cards: todos
      },
      {
        id: 2,
        title: "Doing",
        cards: doings
      },
      {
        id: 3,
        title: "Done",
        cards: dones
      }
    ]
  };

  assignments.forEach(item => {
    const card = {
      id: item.plannable_id,
      courseId: item.course_id,
      title: item.plannable.title,
      dueAt: item.plannable.due_at,
      courseName: item.context_name,
      color: colors.custom_colors[`course_${item.course_id}`]
    };

    // If doing
    if (doingIds.includes(card.id)) {
      doings.push(card);
    } else {
      // If override exists but not marked as complete
      if (item.planner_override && !item.planner_override.marked_complete) {
        todos.push({ ...card, override_id: item.planner_override.id });

        // If  override exists and is marked as complete
      } else if (
        item.planner_override &&
        item.planner_override.marked_complete
      ) {
        dones.push({ ...card, override_id: item.planner_override.id });

        // If override exists and submitted
      } else if (item.planner_override && item.submissions.submitted) {
        // TODO: Create an override marking as done
        dones.push({ ...card, override_id: item.planner_override.id });
        // If override does not exist but submitted
      } else if (item.submissions.submitted) {
        dones.push(card);
      } else {
        todos.push(card);
      }
    }
  });
  const [board, setBoard] = useState(initialBoard);

  function onBoardChange(newBoard) {
    setBoard(newBoard);
    console.log("Canvas Token: " + process.env.canvasToken);

    // mark as done
    newBoard.columns[newBoard.columns.length - 1].cards.forEach(async card => {
      // If the card wasn't found in the old board we can do API requests on it
      if (!board.columns[board.columns.length - 1].cards.includes(card)) {
        // If the card contains an override_id we know we can just mark it as done there. Otherwise we wil need to create the override.
        if (card.override_id) {
          await markAsDone(card.override_id);
        } else {
          await createDoneOverride(card.id);
        }
      }
    });
    // Mark as not done
    newBoard.columns[0].cards.forEach(async card => {
      if (!board.columns[0].cards.includes(card)) {
        if (card.override_id) {
          await markAsNotDone(card.override_id);
        } else {
          await createNotDoneOverride(card.id);
        }
      }
    });

    // Mark as doing, AND mark as not done
    if (board.columns[1] !== newBoard.columns[1]) {
      let doingIds = [];
      newBoard.columns[1].cards.forEach(async card => {
        // Add the ID to the array
        doingIds.push(card.id);
        if (!board.columns[0].cards.includes(card)) {
          // Mark as not done (since we are "doing" so it's not done)
          if (card.override_id) {
            await markAsNotDone(card.override_id);
          } else {
            await createNotDoneOverride(card.id);
          }
        }
      });

      // Mark Ids as doing
      (async () => {
        await markAsDoing(doingIds);
      })();
    }
  }

  return (
    <div className={classes.board}>
      <ReactBoard
        // @ts-ignore
        initialBoard={initialBoard}
        onCardDragEnd={onBoardChange}
        disableColumnDrag
        renderColumnHeader={props => <ColumnHeader {...props} />}
        renderCard={(props, cardBag) => (
          <Card {...props} dragging={cardBag.dragging} />
        )}
      />
    </div>
  );
}
