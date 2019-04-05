import JournalTemplate from './journalTemplate';
import TempTestAppTemplate from './tempTestAppTemplate';
import HelloWorldTemplate from './helloWorldTemplate';
import WovynDeviceTemplate from './wovynDeviceTemplate';
import ThingTemplate from './ThingTemplate';
import CommunityTemplate from './CommunityTemplate';
import NeighborhoodTemps from './NeighborhoodTemps';
import SafeAndMineApp from '../Apps/Picolabs/SafeAndMine/SafeAndMineApp';
import JournalApp from '../Apps/Picolabs/Journal/JournalApp';
import DominosPizzaApp from '../Apps/Picolabs/DominosPizza/DominosPizzaApp';
import SovrinAgent from '../Apps/Picolabs/SovrinAgent/SovrinAgent';

export default {
  //'io.picolabs.journal': JournalTemplate,
  'io.picolabs.journal': JournalApp,
  'io.picolabs.tempTestApp': TempTestAppTemplate,
  'io.picolabs.helloWorld': HelloWorldTemplate,
  'io.picolabs.wovyn_device': WovynDeviceTemplate,
  'io.picolabs.thing': ThingTemplate,
  'io.picolabs.community': CommunityTemplate,
  'io.picolabs.neighborhood_temps': NeighborhoodTemps,
  'io.picolabs.safeandmine': SafeAndMineApp,
  'io.picolabs.pizza': DominosPizzaApp,
  'org.sovrin.manifold_agent':SovrinAgent
}
