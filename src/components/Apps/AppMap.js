import SafeAndMineApp from './Picolabs/SafeAndMine/SafeAndMineApp';
import JournalApp from './Picolabs/Journal/JournalApp';
import ScoreTracker from './Picolabs/ScoreTracker/ScoreTracker';
import OrderPizzaApp from './Picolabs/OrderPizza/OrderPizzaApp';
import SovrinAgent from './Picolabs/SovrinAgent/SovrinAgent'

export default {
  "io.picolabs.safeandmine" : SafeAndMineApp,
  "io.picolabs.journal" : JournalApp,
  "io.picolabs.score_tracker": ScoreTracker,
  "io.picolabs.pizza": OrderPizzaApp,
  "org.sovrin.manifold_agent":SovrinAgent
}
