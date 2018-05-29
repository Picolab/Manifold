import JournalTemplate from './journalTemplate';
import TempTestAppTemplate from './tempTestAppTemplate';
import HelloWorldTemplate from './helloWorldTemplate';
import WovynDeviceTemplate from './wovynDeviceTemplate';
import ThingTemplate from './ThingTemplate';
import CommunityTemplate from './CommunityTemplate';
import NeighborhoodTemps from './NeighborhoodTemps';

/*
In the future, consider abandoning this mapping of a string to a component with the Webpack Externals.
The webpack externals would allow a developer to alter their component without having to come to whoever is
hosting a version of Manifold and reregister their component to fix a bug. This also causes possible security
issues for when someone at a remote location creates a component that accesses the redux store and steals sensitive info
See https://webpack.js.org/configuration/externals/ for more information.
*/
export default {
  'io.picolabs.journal': JournalTemplate,
  'io.picolabs.tempTestApp': TempTestAppTemplate,
  'io.picolabs.helloWorld': HelloWorldTemplate,
  'io.picolabs.wovyn_device': WovynDeviceTemplate,
  'io.picolabs.thing': ThingTemplate,
  'io.picolabs.community': CommunityTemplate,
  'io.picolabs.neighborhood_temps': NeighborhoodTemps
}
