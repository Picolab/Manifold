import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getName } from '../../reducers';
import routes from '../../routes';

const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  //console.log(paths);
  return paths;
};

const mapStateToProps = (state, ownProps) => {
  let routeName = findRouteName(ownProps.match.url);
  if(!routeName) {
    //if not defined in our routes map, just use whatever is in the url
    const currentURLArray = ownProps.match.url.split("/");
    routeName = currentURLArray[currentURLArray.length - 1];
  }
  return {
    routeName,
    picoName: getName(state, routeName)
  }
};

const BreadcrumbsItem = connect(mapStateToProps)(({ routeName, picoName, match, ...rest }) => {
  const displayName = picoName || routeName;
  return (
    match.isExact ?
    (
      <BreadcrumbItem active>{displayName}</BreadcrumbItem>
    ) :
    (
      <BreadcrumbItem>
        <Link to={match.url || ''}>
          {displayName}
        </Link>
      </BreadcrumbItem>
    )
  );
});

const Breadcrumbs = ({ location : { pathname }, match, ...rest }) => {
  const paths = getPaths(pathname);
  //const i = 0;
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem} />);
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};

export default props => (
  <div>
    <Route path="/:path" component={Breadcrumbs} {...props} />
  </div>
);
