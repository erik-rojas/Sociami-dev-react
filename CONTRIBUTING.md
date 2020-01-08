
### Editor

Setup your code editor and plugins. Recommended:

- https://code.visualstudio.com/
- https://atom.io/
-  https://www.jetbrains.com/webstorm/

Don't use sublime, notepad++, vim etc - you will miss many critical plugins provided by the community.

Make sure you have:

- .editorconfig support -  https://editorconfig.org
-  Install https://prettier.io and setup it run on save. You don't have excuses not to use it at 2k18

### Writing code

Don't write render methods more than one-two monitor screen heights. If you need more - split functional components. You may keep it at the same file.

Use consistent naming for files. MyComponent.js for React component. myComponent.css for css

We don't have css modules support. Styles may collide and override each over. Use http://getbem.com/introduction for class namings. https://cssguidelin.es/#bem-like-naming

You don't need to pass new objects constructed with Object.assign to React component's state. New objects are required for redux reducers, but not for react's setState. Just use
```
this.setState({updatedField: 'new value'});
```

You don't need to explicitly use bindActionCreator. mapDispatchToProps implicitly wraps action creators with dispatch call.

```
const mapDispatchToProps = { createUser, deleteUser };
```

### Debugging

**STOP USING CONSOLE.LOG FOR DEBUGGING AND NEVER EVER COMMIT THEM TO REPO**

Install React developer tools https://github.com/facebook/react-devtools If you need to inspect component props, state or hierarchy - just use dev tools instead of console.log

Install https://github.com/zalmoxisus/redux-devtools-extension If need to inspect store content, action order or anything redux related. Devtools already plugged to project.

### Authorization logic

It's complicated

- App.js renders
- Check local storage if we were authorized before
- If a user was not authorized, render landing page.
- If the user was authorized set App.js state and login procedure will be executed in componentDidUpdate
- The real login code stands in App.js ```componentDidUpdate``` It checks if faceBookID, linkedinID or userID is updated and get a profile from the database.
- When user logins with a social network, after oAuth callback actually executed the same setState for App.js passing received from query string ID
