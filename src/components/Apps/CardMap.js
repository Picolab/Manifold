import SafeAndMineCardView from './Picolabs/SafeAndMine/SafeAndMineCardView';
import JournalCardView from './Picolabs/Journal/JournalCardView';
import UTA from './Picolabs/UTA/UTA';
import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
import OrderPizzaApp from './Picolabs/OrderPizza/OrderPizzaApp';
import SovrinAgent from './Picolabs/SovrinAgent/SovrinAgent';
import AuroraCardView from './Picolabs/Aurora/AuroraCardView';
import WeatherCardView from './Picolabs/Weather/WeatherCardView';

export default {
  "io.picolabs.safeandmine" : SafeAndMineCardView,
  "io.picolabs.journal" : JournalCardView,
  "io.picolabs.uta": UTA,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaApp,
  "org.sovrin.manifold_agent": SovrinAgent,
  "io.picolabs.aurora_app": AuroraCardView,
  "io.picolabs.weather": WeatherCardView
}
