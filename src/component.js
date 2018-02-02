import {createElement} from 'react';
import {connect} from 'react-redux';


const mapStateToProps = ({router}) => router;

const Router = ({history, location, path, params}) => {
  return path.reduce((tree, {route: {component}}) => {
    if (!component) {
      return tree;
    }
    return createElement(component, {params}, tree);
  }, null);
};
export default connect(mapStateToProps)(Router);
