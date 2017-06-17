import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment-with-locales-es6';
import FileUpload from './FileUpload';
import './App.css';

moment.locale('es');
class App extends Component {
  constructor () {
    super();
    this.state = {
      user: null,
      uploadValue: 0,
      pictures: []
    };

    // render
    this.renderLoginButton = this.renderLoginButton.bind(this);
    // auth
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    // files
    this.handleUpload = this.handleUpload.bind(this);
    // debug
    this.renderJSON = this.renderJSON.bind(this);
    // user
    this.refresh = this.refresh.bind(this);
    this.setPictures = this.setPictures.bind(this);
    this.resetPictures = this.resetPictures.bind(this);

  }

  // Actualizar estado react
  refresh () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
      this.setPictures();
    });
  }

  // Modificar pictures
  setPictures () {
    if (this.state.user) {
      firebase.database().ref('pictures').on('child_added', snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });
    } else {
      this.resetPictures();
    }
  }

  // Reset pictures
  resetPictures () {
    this.setState({ pictures: [] });
  }

  // Cuando se renderiza App en el DOM
  componentWillMount () {
    this.refresh();
  }

  // Login
  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión.`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  // Logout
  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha salido.`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  // Subir imagen
  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      });
    }, error => {
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL,
        created: moment().valueOf()
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  // Login/Logout
  renderLoginButton () {
    // Si esta logeado
    if (this.state.user) {
      return (
        <div className='App-upload blue'>
          <div className="box blue">Upload</div><hr/>
          <br/>
          <img width='100' className='img-user' src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>

          <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue}/>

          <div className='App-images pink'>
            <div className="box pink">Base de Datos</div><hr/>
            {
              this.state.pictures.map( (picture, index) => (
                <div key={index}>
                  <img width='520' src={picture.image} alt=''/>
                  <br/>
                  <img width='50' className='img-user' src={picture.photoURL} alt={picture.displayName}/>
                  <br/>
                  <span>{picture.displayName}</span>
                  <p>
                    <small>{moment(picture.created).calendar()}</small>
                  </p>
                  <hr/>
                </div>
              )).reverse()
            }
          </div>
        </div>
      );
    } else {
      // Si no
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }
  }

  // Debug
  renderJSON () {
    return (
      <pre>
        user = {JSON.stringify(this.state.user, null, 2)}
        <br/>
        <hr/>
        pictures = {JSON.stringify(this.state.pictures, null, 2)}
      </pre>
    )
  }

  // App
  render() {
    return (
      <div className="App red">
        <div className="box red">App</div><hr/>
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <div className="App-login yellow">
          <div className="box yellow">Login/logut</div><hr/>
          { this.renderLoginButton() }
        </div>
        { this.renderJSON() }
      </div>
    );
  }
}

export default App;
