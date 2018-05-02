import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

//The following code throws errors on extremely sensitive things that normall pass tests.
// Fail tests on any warning
// console.error = message => {
//    throw new Error(message);
// };
