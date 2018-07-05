import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import PropTypes from 'prop-types';
import { customEvent, customQuery } from '../../utils/manifoldSDK';
import { getDID } from '../../reducers';


class ManifoldAppComponent extends Component {
    constructor(props) {
        super(props)
        this.manifoldQuery = this.manifoldQuery.bind(this);
    }

    manifoldQuery (query, options) {
        return customQuery(this.props.DID, query.rid, query.funcName, query.funcArgs);
    }

    render() {
        let DeveloperComponent = this.props.developer_component
        return (
            <DeveloperComponent
                {...(this.props)} manifoldQuery={this.manifoldQuery}
            />
        )
    }
}

ManifoldAppComponent.propTypes = {
    developer_component: PropTypes.func.isRequired,
    picoID: PropTypes.string.isRequired,
    DID: PropTypes.string.isRequired,
    bindings: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
      DID: getDID(state, ownProps.picoID)
    }
}
//customEvent(DID, domain, type, attributes
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      manifoldEvent: (DID, event, options) => {
        dispatch(commandAction(customEvent, [
            DID,
            event.domain,
            event.type,
            event.attrs
        ], options))
      }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManifoldAppComponent);
