import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '../../utilities/loading';

class DeleteUserCount extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      nameValidator: '',
      passwordValidator: '',
      validationUsername: false,
      validationPassword: false,
      deleteUser: false,
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    
    Meteor.logout();
    const user = Meteor.users.findOne({ _id: nextProps.userId });
    let username = null;
    let id = null;

    if (user && user.profile.active) {
      username = user.username;
      id = user._id;
    }

    this.setState({
      username,
      userId: id,
      loading: nextProps.loading,
    });
  }

  deleteCountUser() {
    const { userId } = this.state;

    Meteor.call('deleteAppUser', userId, (error, respose) => {
      this.setState({ loading: false });
      if (error) {
        if (error.error === "has-audits") {
          Session.set('ERROR_MESSAGE',TAPi18n.__('active_audits'));
          $('#modalError').modal('show');
        } else if(error.error === "has-tags"){
          Session.set('ERROR_MESSAGE',TAPi18n.__('active_tags'));
          $('#modalError').modal('show');	
        } else {
          Session.set('ERROR_MESSAGE',TAPi18n.__('error_deleting_user'));
          $('#modalError').modal('show');
        }
      } else if(respose) {
        this.setState({ validationPassword: true });
        Session.set('SUCCESS_MESSAGE',TAPi18n.__('user_deleted'));
        $('#modalSuccess').modal('show');
      }
    });
  }

  validatorPassword() {
    const { userId, passwordValidator, } = this.state;
    this.setState({ loading: true });
    const password = Accounts._hashPassword(passwordValidator);

    Meteor.call('checkPassword', userId, password, (error, result) => {
      this.setState({ loading: false });
      if (error) {
        let message = error.reason || TAPi18n.__('incorrect_username_password');
        return alert(message);
      }

      this.deleteCountUser();
    });
  }

  renderConfirmUserByPassword() {
    const { passwordValidator } = this.state;

    return (
      <div className='container-settings'>
        <div className='ui placeholder green center aligned segment'>
          <div className='ui icon header'>
            <i className='circular inverted green key icon' />
            {TAPi18n.__('confirm_password')}
          </div>
          <form className='ui form'>
            <div className='field'>
              <label>{TAPi18n.__('password')}</label>
              <input
                type='password'
                name='password'
                value={ passwordValidator }
                onChange={e => this.setState({ passwordValidator: e.target.value })}
              />
            </div>
            <button
              className='ui green button'
              type='button'
              onClick={() => this.validatorPassword()}
            >
              {TAPi18n.__('confirm_password')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  successDeletedCount() {
    return (
      <div className='container-settings'>
        <div className='ui teal center aligned segment container-item'>
          <div className='ui icon header'>
            <i className='circular teal trash alternate outline icon' />
            <h2>{TAPi18n.__('success')}</h2>
            <p>{TAPi18n.__('account_deleted')}</p>
          </div>
        </div>
      </div>
    );
  }

  noFound() {
    return (
      <div className='container-settings'>
        <div className='ui teal center aligned segment container-item'>
          <div className='ui icon header'>
            <i className='big user times icon' />
            <h2>{TAPi18n.__('error')}</h2>
            <p>{TAPi18n.__('page_not_found')}</p>
          </div>
        </div>
      </div>
    );
  }

  render() {

    const {
      loading, nameValidator, userId, username, validationPassword, validationUsername,
    } = this.state;

    if (loading) {
      return <Loading />
    }

    if (!userId) {
      return this.noFound();
    }

    if (validationUsername && !validationPassword) {
      return this.renderConfirmUserByPassword();
    }

    if (validationUsername && validationPassword) {
      return this.successDeletedCount();
    }

    const succesUsername = username == nameValidator;
    const styleBtn = succesUsername ? '' : 'disabled'

    return (
      <div className='container-settings'>
        <div className='ui red center aligned segment'>
          <div className='ui icon header'>
            <i className='circular red inverted user times icon' />
            <h2>{TAPi18n.__('want_delete_account')}</h2>
            <p>{TAPi18n.__('deleting_account')}</p>
          </div>
          <form className='ui form'>
            <div className='field'>
              <label>{TAPi18n.__('confirm_type')}{' '}{username}</label>
              <input
                type='text'
                name='first-name'
                value={ nameValidator }
                onChange={e => this.setState({ nameValidator: e.target.value })}
                required
              />
            </div>
            <button
              className={`ui red button ${styleBtn}`}
              type='button'
              onClick={() => this.setState({ validationUsername: succesUsername })}
            >
              {TAPi18n.__('delete_acount')}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  const url = Router.current().originalUrl;
  const tokens = url.split('/');
  const userId = tokens[ tokens.length -1 ];

  const handles = [
    Meteor.subscribe('allActiveUsers'),
  ];

  const loading = handles.some(handle => !handle.ready());

  return {
    userId,
    loading,
  }
})(DeleteUserCount);
