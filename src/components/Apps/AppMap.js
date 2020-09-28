import SafeAndMineApp from './Picolabs/SafeAndMine/SafeAndMineApp';
import JournalApp from './Picolabs/Journal/JournalApp';
import UTA from './Picolabs/UTA/UTA';
import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
import OrderPizzaApp from './Picolabs/OrderPizza/OrderPizzaApp';
import Aurora from './Picolabs/Aurora/Aurora';
import Weather from './Picolabs/Weather/Weather';
import CO2 from './Picolabs/Wovyn/CO2/CO2';
import Temperatures from './Picolabs/Wovyn/Temperatures/Temperatures';
import Light from './Picolabs/Wovyn/Light/Light';
import Reminders from './Picolabs/Reminders/Reminders';
import SmartMirror from './Picolabs/SmartMirror/SmartMirror';
import ManifoldMonitor from './Picolabs/ManifoldMonitor/ManifoldMonitor';
import CloudAgent from './Picolabs/CloudAgent/CloudAgent';
import DungeonsAndDragons from './Picolabs/D&D/DungeonsAndDragons';

export default {
  "io.picolabs.safeandmine" : SafeAndMineApp,
  "io.picolabs.journal" : JournalApp,
  "io.picolabs.uta": UTA,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaApp,
  "io.picolabs.aurora_app": Aurora,
  "io.picolabs.weather": Weather,
  "io.picolabs.co2_app": CO2,
  "io.picolabs.temperatures_app": Temperatures,
  "io.picolabs.light_app": Light,
  "io.picolabs.reminders": Reminders,
  "io.picolabs.manifold.smart_mirror": SmartMirror,
  "io.picolabs.manifold_monitor": ManifoldMonitor,
  "io.picolabs.manifold_cloud_agent": CloudAgent,
  "DND_Game": DungeonsAndDragons
}
