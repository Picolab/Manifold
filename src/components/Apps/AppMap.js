import SafeAndMineApp from './Picolabs/SafeAndMine/SafeAndMineApp';
import JournalApp from './Picolabs/Journal/JournalApp';
// import UTA from './Picolabs/UTA/UTA';
// import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
// import OrderPizzaApp from './Picolabs/OrderPizza/OrderPizzaApp';
import SovrinAgent from './Picolabs/SovrinAgent/SovrinAgent';
// import Aurora from './Picolabs/Aurora/Aurora';
import Weather from './Picolabs/Weather/Weather';
// import CO2 from './Picolabs/Wovyn/CO2/CO2';
// import Temperatures from './Picolabs/Wovyn/Temperatures/Temperatures';
// import Light from './Picolabs/Wovyn/Light/Light';
import Reminders from './Picolabs/Reminders/Reminders';
import SmartMirror from './Picolabs/SmartMirror/SmartMirror';
import ManifoldMonitor from './Picolabs/ManifoldMonitor/ManifoldMonitor';

export default {
  "io.picolabs.safeandmine" : SafeAndMineApp,
  "io.picolabs.journal" : JournalApp,
  "io.picolabs.uta": UTA,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaApp,
  "org.sovrin.manifold_agent": SovrinAgent,
  "io.picolabs.aurora_app": Aurora,
  "io.picolabs.weather": Weather,
  "io.picolabs.co2_app": CO2,
  "io.picolabs.temperatures_app": Temperatures,
  "io.picolabs.light_app": Light,
  "io.picolabs.reminders": Reminders,
  "io.picolabs.manifold.smart_mirror": SmartMirror,
  "io.picolabs.manifold_monitor": ManifoldMonitor
}
