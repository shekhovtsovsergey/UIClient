import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import green from "@material-ui/core/colors/green";
import Chip from "@material-ui/core/Chip/Chip";
import Icon from "@material-ui/core/Icon/Icon";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/es/colors/orange";
import config from '../config';

const theme = createMuiTheme();

const styles = {
  listItem: {
    paddingBottom: 4
  },
  chip: {
    marginLeft: theme.spacing.unit,
    fontSize: 11,
    height: 23,
  },
  priorityIcon: {
    fontSize: 40,
    margin: '-7px 0 -6px 0'
  },
  bigPriorityIcon: {
    fontSize: 30,
    margin: '-2px 0 -1px 0'
  },
  issueTitle: {
    marginLeft: 10
  },
  issueStateGrid: {
    textAlign: 'center'
  },
  orderByLabel: {
    textAlign: 'right'
  },
  orderByIcon: {
    color: '#fff',
    fontSize: 30
  },
  orderByButton: {
    height: 30,
    width: 30
  }
};

export default class IssueList extends Component {

  state = {
    issues: [],
    priorityDirection: null,
    statusDirection: null
  };

  loadData() {
    const url = `${config.host}/issue-tracker/issues`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.props.keycloak.token()}`
      }
    })
        .then(res => res.json())
        .then(res => this.setState({ issues: res }))
        .catch(error => console.error('Error:', error));
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(props, context) {
    this.loadData();
  }

  getPriorityIcon(priorityName) {
    switch (priorityName) {
      case 'VERY_LOW': return (
          <Icon style={Object.assign({}, styles.bigPriorityIcon, {color: green["900"]})} >arrow_downward</Icon>
      );

      case 'LOW': return (
          <Icon style={Object.assign({}, styles.priorityIcon, {color: green["200"]})} >expand_more</Icon>
      );

      case 'MEDIUM': return (
          <Icon style={Object.assign({}, styles.bigPriorityIcon, {color: orange["500"]})}>remove</Icon>
      );

      case 'HIGH': return (
          <Icon style={Object.assign({}, styles.priorityIcon, {color: red["200"]})}>expand_less</Icon>
      );
    }
  }

  render() {
    return (
        <div>
          {this.state.issues.map(issue => (
              <ListItem style={styles.listItem} key={issue.id}>
                <Grid container>
                  <Grid item xs={2} style={styles.issueStateGrid}>
                    <Icon style={styles.priorityIcon}>{this.getPriorityIcon(issue.priority)}</Icon>
                    <Typography variant="caption">{issue.visibleId}</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subheading" style={styles.issueTitle}>{issue.title}</Typography>
                    <Typography>{issue.description}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Chip style={styles.chip} label={issue.status} color="primary" />
                  </Grid>
                </Grid>
              </ListItem>
          ))}
        </div>
    );
  }
}