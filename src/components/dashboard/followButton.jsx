import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Actions } from '../../store/actions.js';
import store from '../../store/store.js';
import { typeOfActions } from '../../store/actions.js';

class FollowButton extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.mainUpdate = this.mainUpdate.bind(this);
  }
  componentDidMount() {
    store.on(typeOfActions.ADD_BOOKMARK, this.mainUpdate);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.id !== this.props.id || this.state !== nextState)
      return true;
    else
      return false;
  }
  componentWillUnmount() {
    store.removeListener(typeOfActions.ADD_BOOKMARK, this.mainUpdate);
  }
  mainUpdate() {
    this.forceUpdate();
  }
  update() {
    const { id } = this.props;
    const marked = store.bookmarks.indexOf(id) > -1
      ? true
      : false;
    this.setState({ marked });
  }
  render() {
    const { id } = this.props;
    let marked = store.bookmarks.indexOf(id) > -1
      ? true
      : false;

    let name;
    let classIcon;
    if (!marked) {
      name = 'follow';
      classIcon = 'far fa-heart';
    } else if (marked) {
      name = 'followed';
      classIcon = 'fas fa-heart';
    }

    const buttonProps = {
      className: 'button follow',
      onClick: () => Actions.addBookmark(id)
    };

    return <button {...buttonProps} >
      <i className={classIcon} />&nbsp;{name}
    </button>;
  }
}

FollowButton.propTypes = {
  id: PropTypes.any
};

export default FollowButton;
