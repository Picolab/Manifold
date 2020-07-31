import SafeAndMineCardView from './Picolabs/SafeAndMine/SafeAndMineCardView';
import JournalCardView from './Picolabs/Journal/JournalCardView';
import UTA from './Picolabs/UTA/UTA';
import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
import OrderPizzaCardView from './Picolabs/OrderPizza/OrderPizzaCardView';
import AuroraCardView from './Picolabs/Aurora/AuroraCardView';
import WeatherCardView from './Picolabs/Weather/WeatherCardView';
import CO2CardView from './Picolabs/Wovyn/CO2/CO2CardView';
import TemperaturesCardView from './Picolabs/Wovyn/Temperatures/TemperaturesCardView';
import LightCardView from './Picolabs/Wovyn/Light/LightCardView';
import Reminders from './Picolabs/Reminders/Reminders';
import SmartMirrorCardView from './Picolabs/SmartMirror/SmartMirrorCardView';
import ManifoldMonitor from './Picolabs/ManifoldMonitor/CardView';
import CloudAgentCard from './Picolabs/CloudAgent/CloudAgentCard';
import DungeonsAndDragons from './Picolabs/D&D/DungeonsAndDragons';

export default {
  "io.picolabs.safeandmine" : SafeAndMineCardView,
  "io.picolabs.journal" : JournalCardView,
  "io.picolabs.uta": UTA,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaCardView,
  "io.picolabs.aurora_app": AuroraCardView,
  "io.picolabs.weather": WeatherCardView,
  "io.picolabs.co2_app": CO2CardView,
  "io.picolabs.temperatures_app": TemperaturesCardView,
  "io.picolabs.light_app": LightCardView,
  "io.picolabs.reminders": Reminders,
  "io.picolabs.manifold.smart_mirror": SmartMirrorCardView,
  "io.picolabs.manifold_monitor": ManifoldMonitor,
  "io.picolabs.manifold_cloud_agent": CloudAgentCard,
  "D-D_Game": DungeonsAndDragons
}
