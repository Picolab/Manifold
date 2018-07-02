import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import PropTypes from 'prop-types';
import {customEvent, customQuery} from '../../utils/manifoldSDK';


class ManifoldAppComponent extends Component {
    constructor(props) {
        super(props)
        this.manifoldQuery = this.manifoldQuery.bind(this);
    }

    manifoldQuery (query, options) {
        return customQuery(this.props.eci, query.rid, query.funcName, query.funcArgs);
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
    pico_id: PropTypes.string.isRequired,
    eci: PropTypes.string.isRequired,
    bindings: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {}
}
//customEvent(eci, domain, type, attributes
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      manifoldEvent: (event, options) => {
        dispatch(commandAction(customEvent, [
            ownProps.eci,
            event.domain,
            event.type,
            event.attrs
        ], options))
      }

    }
}

// export default function ManifoldApp(props) {
//     let ConnectedManifoldApp = connect(mapStateToProps, mapDispatchToProps)(ManifoldAppComponent)
//     return(
//         <ConnectedManifoldApp
//             {...props}
//         />
//     )
// }

export default connect(mapStateToProps, mapDispatchToProps)(ManifoldAppComponent);
