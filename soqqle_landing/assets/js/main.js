
/*add subscriber through backend, using 'axios' library*/
var addGroupSubscriber = function addGroupSubscriber(groupId, subscriber, onCallbackSuccess, onCallbackFail) {
    var body = {groupId: groupId, name: subscriber.name, email: subscriber.email};

    axios.post('http://13.59.19.153:8080/addSubscriberToGroup', body)
      .then(function (response) {
        onCallbackSuccess(response);
      })
      .catch(function (error) {
        onCallbackFail(error);
      });
}
/******************************************************** */

//logic for adding subscribers into groups
var lastActiveModal = undefined;

  /* server response handlers */
  var handleGroupSubscriberAddSuccess = function handleGroupSubscriberAddSuccess(response) {
    console.log("Successfully added");
    console.dir(response.data);

    //hide modal after server response received
    $(lastActiveModal).modal('hide');
    onNetworkOperationFinish(lastActiveModal);
    lastActiveModal = undefined;
  }

  var handleGroupSubscriberAddFail = function handleGroupSubscriberAddFail(error) {
    console.log("Failed to add subscriber: " + error);

    //hide modal after server response received
    $(lastActiveModal).modal('hide');
    onNetworkOperationFinish(lastActiveModal);
    lastActiveModal = undefined;
  }
  /**************************************** */

  /*put code for visual notification of network request in progress here (loading spinner)*/
  var onNetworkOperationStart = function onNetworkOperationStart(modal) {
    console.log("Loading...");
    //put code for showing the spinner here
  }

  var onNetworkOperationFinish = function onNetworkOperationFinish(modal) {
    console.log("Complete!");
    //put code for hiding the spinner here
  }

  /* add click event listeners for modal buttons */
  //modal #token
  $(".modal#token").on("click","#ok",function() { 
    var name = $("#token-name").val();
    var email = $("#token-email").val();

    lastActiveModal = ".modal#token";
    
    //add subscriber, with name and email taken from input fields
    onNetworkOperationStart(lastActiveModal);
    addGroupSubscriber(9146090, {name: name, email: email}, handleGroupSubscriberAddSuccess, handleGroupSubscriberAddFail);
  });
    
  $(".modal#token").on("click","#cancel",function() { 
    console.log("Modal token cancel");
  });

  //modal #alpha
  $(".modal#alpha").on("click","#ok",function() { 
      var name = $("#alpha-name").val();
      var email = $("#alpha-email").val();

      lastActiveModal = ".modal#alpha";
      
      //add subscriber, with name and email taken from input fields
      onNetworkOperationStart(lastActiveModal);
      addGroupSubscriber(8797324, {name: name, email: email}, handleGroupSubscriberAddSuccess, handleGroupSubscriberAddFail);
  });
    
  $(".modal#alpha").on("click","#cancel",function() { 
    console.log("Modal alpha cancel");
  });
  /****************************************************** */