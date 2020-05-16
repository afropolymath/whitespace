import { shallow } from 'enzyme';

import Home, { SlidingContainer, GoogleButton } from '../../pages/index';
import { LogoText } from '../../components/shared/typography';
import { Button } from '../../components/shared/forms';
import { loginWithGoogle } from '../../lib/firebase';

jest.mock('../../lib/firebase', () => ({
  loginWithGoogle: jest.fn(),
}));

describe('Home page tests', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Home />);
  });

  it('renders the page properly', () => {
    expect(component.find(LogoText)).toHaveLength(1);
  });

  it('toggles login controls when we click the button', () => {
    expect(component.find(Button)).toHaveLength(1);
    expect(component.find(SlidingContainer).prop('isVisible')).toBeFalsy();
    component.find(Button).simulate('click');
    expect(component.find(SlidingContainer).prop('isVisible')).toBeTruthy();
    component.find(GoogleButton).simulate('click');
    expect(loginWithGoogle).toHaveBeenCalled();
  });
});
