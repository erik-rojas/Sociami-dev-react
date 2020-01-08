
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

var showDialog = function showDialog(success) {
  if (success) {
    $("#modal_success").modal("show");
  }
  else {
    $("#modal_failure").modal("show");
  }
}

var toggleProgress = function toggleProgress(success) {
  if (success) {
    $("#modal_in_progress").modal("show");
  }
  else {
    $("#modal_in_progress").modal("hide");
  }
}

//logic for adding subscribers into groups
var lastActiveInputField = undefined;

  /* server response handlers */
  var handleGroupSubscriberAddSuccess = function handleGroupSubscriberAddSuccess(response) {
    console.log("Successfully added");
    console.dir(response.data);

    onNetworkOperationFinish();

    showDialog(true);
  }

  var handleGroupSubscriberAddFail = function handleGroupSubscriberAddFail(error) {
    console.log("Failed to add subscriber: " + error);

    onNetworkOperationFinish();

    showDialog(false);
  }
  /**************************************** */

  /*put code for visual notification of network request in progress here (loading spinner)*/
  var onNetworkOperationStart = function onNetworkOperationStart() {
    console.log("Loading...");
    toggleProgress(true);
    //put code for showing the spinner here
  }

  var onNetworkOperationFinish = function onNetworkOperationFinish() {
    console.log("Complete!");
    //put code for hiding the spinner here
    console.log("lastActiveInputField: " + lastActiveInputField);
    console.log("lastActiveInputField.value: " + $(lastActiveInputField).val());
    lastActiveInputField = undefined;
    toggleProgress(false);
  }

  /* add click event listeners for modal buttons */
  //form_subscribe_news_letter
  var NewsLetterFormId = "#form_subscribe_news_letter";
  var NewsLetterInputId = "#newsletter-form-email";
  $(NewsLetterFormId).on("submit", function(e) {
    e.preventDefault();

    if (lastActiveInputField) {
      return;
    }
    
    var name = "empty";
    var email = $(NewsLetterInputId).val();

    console.log("name: " + name);
    console.log("email: " + email);

    lastActiveInputField = NewsLetterInputId;

    onNetworkOperationStart();
    addGroupSubscriber(9224454, {name: name, email: email}, handleGroupSubscriberAddSuccess, handleGroupSubscriberAddFail);
  });
    
    //form_subscribe_sponsor
    var SponsorFormId = "#form_subscribe_sponsor";
    var SponsorFormInputId = "#sponsor-form-email";
    $(SponsorFormId).on("submit", function(e) {
      e.preventDefault();

      if (lastActiveInputField) {
        return;
      }

      var name = "empty";
      var email = $(SponsorFormInputId).val();
  
      console.log("name: " + name);
      console.log("email: " + email);
  
      lastActiveInputField = SponsorFormInputId;
  
      onNetworkOperationStart();
      addGroupSubscriber(9227992, {name: name, email: email}, handleGroupSubscriberAddSuccess, handleGroupSubscriberAddFail);
    });
  /****************************************************** */