import { Template } from 'meteor/templating';
import DeleteUserCount from './DeleteUserCountComponent';

import './deleteUserCount.html';

Template.deleteUserCount.helpers({

  DeleteCount() {
    return DeleteUserCount;
  }

});
