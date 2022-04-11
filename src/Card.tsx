import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Truncate from "react-truncate";
import TimeIcon from "@material-ui/icons/AccessTime";
import ModalButton from "./ModalButton";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: 350,
    outline: "none"
  },
  chip: {
    marginBottom: theme.spacing(2)
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  dueAtText: {
    color: theme.palette.text.secondary
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1)
  }
}));

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export default function Card(props) {
  const dueAt = new Date(props.dueAt);
  const currentDate = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);
  let dueString;
  const dateString = `${monthNames[dueAt.getMonth()]} ${dueAt.getDate()}`;

  const dueTime = dueAt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  if (isSameDay(currentDate, dueAt)) {
    dueString = "Today";
  } else if (isSameDay(tomorrow, dueAt)) {
    dueString = "Tomorrow";
  } else {
    dueString = dateString;
  }

  // TODO: Compare and see if it is today or if it is due beforeee aghh
  const cardEl = useRef(null);
  const [update, setUpdate] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (cardEl !== null) {
      const card = cardEl.current;
      // Sigmoid function
      var sigmoid = function(x) {
        return x / (1 + Math.abs(x));
      };

      // Stores X and Y coordinates of Mouse
      var MousePosition = {
        x: 0,
        y: 0
      };

      // Stores X and Y Coordinates of the Card
      var CardPosition = {
        x: 0,
        y: 0
      };

      var xVelocity = 0;
      var rotation = 0;

      setUpdate(
        () =>
          function(dragging) {
            xVelocity = MousePosition.x - CardPosition.x;

            CardPosition.x = MousePosition.x;
            CardPosition.y = MousePosition.y;

            rotation = rotation * 0.9 + sigmoid(xVelocity) * 1.5;

            if (Math.abs(rotation) < 0.01) rotation = 0;

            if (dragging) {
              card.style.transform = `rotate(${rotation}deg)`;
            } else {
              card.style.transform = "none";
            }

            if (update !== null) {
              requestAnimationFrame(dragging => update(dragging));
            }
          }
      );

      document.addEventListener("mousemove", function(e) {
        MousePosition.x = e.clientX;
        MousePosition.y = e.clientY;
      });
    }
  }, []);

  if (update !== null) {
    update(props.dragging);
  }

  return (
    <div
      //@ts-ignore
      ref={cardEl}
      className={classes.root}
      style={{
        boxShadow: props.dragging ? "10px 10px 42px -6px rgba(0,0,0,0.28)" : ""
        // TODO: Make tilt depending on the way it is being dragged which will require wayyyyy more code to do
      }}
    >
      <Chip
        style={{
          color: props.color,
          borderColor: props.color
        }}
        variant="outlined"
        title={props.courseName}
        label={
          <Truncate lines={1} width={280}>
            {props.courseName}
          </Truncate>
        }
        className={classes.chip}
      />
      <Typography>{props.title}</Typography>
      <div className={classes.bottomRow}>
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <TimeIcon className={classes.icon} />
          <Typography
            variant="subtitle2"
            className={classes.dueAtText}
            title={`Due ${dateString} @ ${dueTime}`}
          >
            Due {dueString} @ {dueTime}
          </Typography>
        </div>
        <ModalButton {...props} dueString={dueString} dateString={dateString} dueTime={dueTime}/>
      </div>
    </div>
  );
}
