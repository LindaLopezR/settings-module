import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';

export default class Loading extends React.Component {

  render(){
    return (
      <div className="ui active dimmer">
        <div className="ui text loader">{TAPi18n.__('loading')}</div>
      </div>
    );
  };
}
