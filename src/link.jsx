import * as React from 'react';
import {connect} from 'react-redux';

import {push} from './actions';


class Link extends Component {
  render() {
    const {to, children, ...props} = this.props;
    const href = typeof to === 'string' ? to : to.pathname;
    return (
      <a {...props} onClick={this.handleClick} href={href}>{children}</a>
    );
  }

  _handleClick(event) {
    event.preventDefault();
    this.props.dispatch(push(this.props.to));
  }
  handleClick = this._handleClick.bind(this);
}

export default connect()(Link);
