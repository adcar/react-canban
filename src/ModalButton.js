import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { animated, useSpring } from "react-spring/web.cjs";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import fetch from "isomorphic-unfetch";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 2, 4),
    width: 800,
    maxHeight: "80vh",
    overflowY: "auto"
  },
  noOutline: {
    outline: 0
  },
  divider: {
    marginTop: 20,
    marginBottom: 20
  }
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    }
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

async function getCourse(courseId, assignmentId) {
  const res = await fetch(
    `https://corsssssss.herokuapp.com/https://vsc.instructure.com/api/v1/courses/${courseId}/assignments/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.canvasToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );
  return await res.json();
}

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func
};

export default function SpringModal(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ points: "", description: " " });

  const handleOpen = async () => {
    setOpen(true);
    getCourse(props.courseId, props.id).then(setData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button color="primary" onClick={handleOpen}>
        Info
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open} className={classes.noOutline}>
          <Paper className={classes.paper}>
            <Typography variant="h4" component="h2">
              {props.title}
            </Typography>
            <Divider className={classes.divider} />
            <div
              style={{
                display: "flex"
              }}
            >
              <Typography
                style={{ marginRight: 10 }}
                title={`Due ${props.dateString} @ ${props.dueTime}`}
              >
                <strong>Due </strong>
                {props.dueString} @ {props.dueTime}
              </Typography>
              <Typography style={{ marginLeft: 10 }}>
                <strong>Points</strong> {data.points_possible}
              </Typography>
            </div>
            <Divider className={classes.divider} />

            {data.description === "" ? (
              "No description"
            ) : (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Button
                className={classes.btn}
                color="primary"
                component={"a"}
                href={data.html_url}
              >
                View On Canvas
              </Button>
            </div>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}
