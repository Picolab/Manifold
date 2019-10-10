import SafeAndMineCardView from './Picolabs/SafeAndMine/SafeAndMineCardView';
import JournalCardView from './Picolabs/Journal/JournalCardView';
import UTA from './Picolabs/UTA/UTA';
import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
import OrderPizzaCardView from './Picolabs/OrderPizza/OrderPizzaCardView';
import SovrinAgent from './Picolabs/SovrinAgent/SovrinAgent';
import AuroraCardView from './Picolabs/Aurora/AuroraCardView';
import WeatherCardView from './Picolabs/Weather/WeatherCardView';
import CO2CardView from './Picolabs/Wovyn/CO2/CO2CardView';
import TemperaturesCardView from './Picolabs/Wovyn/Temperatures/TemperaturesCardView';
import LightCardView from './Picolabs/Wovyn/Light/LightCardView';
import Reminders from './Picolabs/Reminders/Reminders';
import SmartMirror from './Picolabs/SmartMirror/SmartMirror';
import NotificationsCycle from './Picolabs/SmartMirror/NotificationsCycle';
import ManifoldMonitor from './Picolabs/ManifoldMonitor/CardView';

export default {
  "io.picolabs.safeandmine" : SafeAndMineCardView,
  "io.picolabs.journal" : JournalCardView,
  "io.picolabs.uta": UTA,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaCardView,
  "org.sovrin.manifold_agent": SovrinAgent,
  "io.picolabs.aurora_app": AuroraCardView,
  "io.picolabs.weather": WeatherCardView,
  "io.picolabs.co2_app": CO2CardView,
  "io.picolabs.temperatures_app": TemperaturesCardView,
  "io.picolabs.light_app": LightCardView,
  "io.picolabs.reminders": Reminders,
  "io.picolabs.manifold.smart_mirror": SmartMirror,
  "io.picolabs.manifold_monitor": ManifoldMonitor

}
