import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';

export default class NoData extends React.Component {

  render(){
    return (
      <div className="no-gembas noData-tell">
        <i className="warning circle icon ui centered huge" />
        <p className="title-noData">{TAPi18n.__('no_data_display')}</p>
      </div>
    );
  };
}
