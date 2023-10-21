import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import config from "../config";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Modal from "@material-ui/core/Modal/Modal";
import Divider from "@material-ui/core/Divider/Divider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import UserService from "../utils/UserService";

const theme = createMuiTheme();

const styles = {
  saveButtonGrid: {
    textAlign: 'right'
  },
  saveButton: {
    borderColor: '#fff'
  },
  rootDiv: {
    padding: 20
  },
  select: {
    marginTop: 10,
    marginBottom: 10,
    minWidth: 100
  },
  loaderDiv: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 20,
    top: '50%',
    left: '50%',
    marginLeft: '-350px',
    marginTop: '-200px',
  }
};

const allLabels = [
  'One',
  'Two',
  'Three',
  'Four',
];

export default class EditIssue extends Component {
  state = {
    hasRequestError: false,
    initStatus: '',
    users: [],
    issue: {
      visibleId: '',
      title: '',
      description: '',
      status: {
        next: [],
        previous: []
      },
      priority: '',
      assignee: {
        id: ''
      },
      labels: []
    },
    error: {}
  };

  loadData(issueId) {
    fetch(`${config.host}/issue-tracker/issues/${issueId}`, {
      headers: {
        'Authorization': `Bearer ${this.props.keycloak.token()}`
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({issue: Object.assign({}, res, {id: null}), initStatus: res.status.current});
        UserService.loadUsers(this.props.keycloak, res.assignee.id, users => this.setState({users: users}));
      })
  }

  pushData = () => {
    fetch(`${config.host}/issue-tracker/issues/${this.state.issue.visibleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.keycloak.token()}`
      },
      body: JSON.stringify(this.state.issue)
    })
      .then(res => {
        if (res.status === 200) this.props.history.push(document.location.pathname.split('/').slice(0, 3).join('/'));
        else return res.json()
      })
      .then(errorRes => this.setState({hasRequestError: true, error: errorRes}))
  };

  componentDidMount() {
    this.loadData(this.props.match.params.issueId)
  }

  componentWillReceiveProps(props, context) {
    this.loadData(props.match.params.issueId)
  }

  handleSelectChange = event => {
    const field = event.target.name;
    const value = event.target.value;

    if (event.target.name === 'assignee-id') {
      this.setState(state => {
        state.issue.assignee.id = value;
        return state;
      });
    } else if(event.target.name === 'status-current') {
      this.setState(state => {
        state.issue.status.current = value;
        return state;
      });
    } else {
      this.setState(state => {
        state.issue[field] = value;
        return state;
      });
    }
  };

  render() {
    if (this.state.issue.visibleId === '') {
      return (
        <div style={styles.loaderDiv}>
          <CircularProgress />
        </div>
      )
    }

    return (
      <React.Fragment>
        <Paper>
          <AppBar position="static" color="primary">
            <Toolbar variant="dense">
              <Grid container alignItems={'center'}>
                <Grid item xs={10}>
                  <Typography variant="h6" color="inherit">[{this.state.issue.visibleId}] Edit</Typography>
                </Grid>
                <Grid item xs={2} style={styles.saveButtonGrid}>
                  <Button
                    color="inherit"
                    style={styles.saveButton}
                    onClick={() => this.props.history.push(document.location.pathname.split('/').slice(0, 3).join('/'))}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    style={styles.saveButton}
                    onClick={this.pushData}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <div style={styles.rootDiv}>
            <TextField
              label="Title"
              fullWidth
              value={this.state.issue.title}
              onChange={this.handleSelectChange}
              margin="normal"
              inputProps={{name: 'title'}}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              value={this.state.issue.description}
              onChange={this.handleSelectChange}
              margin="normal"
              inputProps={{name: 'description'}}
            />

            <FormControl style={styles.select}>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={this.state.issue.assignee.id}
                onChange={this.handleSelectChange}
                inputProps={{name: 'assignee-id'}}
              >
                <MenuItem value={this.props.keycloak.username()}>{this.props.keycloak.name()}</MenuItem>
                <Divider/>
                {this.state.users.map(user => (
                  <MenuItem value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <br/>

            <FormControl style={styles.select}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={this.state.issue.priority}
                onChange={this.handleSelectChange}
                inputProps={{name: 'priority'}}
              >
                <MenuItem value={'VERY_LOW'}>Very Low</MenuItem>
                <MenuItem value={'LOW'}>Low</MenuItem>
                <MenuItem value={'MEDIUM'}>Medium</MenuItem>
                <MenuItem value={'HIGH'}>High</MenuItem>
                <MenuItem value={'VERY_HIGH'}>Very High</MenuItem>
              </Select>
            </FormControl>
            <br/>

            <FormControl style={styles.select}>
              <InputLabel>Status</InputLabel>
              <Select
                value={this.state.issue.status.current}
                onChange={this.handleSelectChange}
                inputProps={{name: 'status-current'}}
              >
                {this.state.issue.status.previous.map(status => (
                  <MenuItem value={status}>{status}</MenuItem>
                ))}
                <Divider/>
                <MenuItem value={this.state.initStatus}>{this.state.initStatus}</MenuItem>
                <Divider/>
                {this.state.issue.status.next.map(status => (
                  <MenuItem value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <br/>

            <FormControl style={styles.select}>
              <InputLabel>Labels</InputLabel>
              <Select
                multiple
                value={this.state.issue.labels ? this.state.issue.labels : []}
                onChange={this.handleSelectChange}
                inputProps={{name: 'labels'}}
              >
                {allLabels.map(label => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Paper>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.hasRequestError}
          onClose={() => this.setState({hasRequestError: false})}
        >
          <div style={styles.modal}>
            <Typography variant="h5" color="error">Bad request</Typography>

            <br />
            <Divider />
            <br />

            <Typography variant="subtitle1"><b>Status:</b> {this.state.error.status}</Typography>
            <Typography variant="subtitle1"><b>Message:</b> {this.state.error.message}</Typography>
          </div>
        </Modal>
      </React.Fragment>

    );
  }
}
