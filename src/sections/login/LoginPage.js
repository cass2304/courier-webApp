
//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Card , Avatar, Form, Input, Button, Icon } from 'antd';
//Components
import ConfirmationAccount from './components/ConfirmationAccount';
import ForgotPassword from './components/ForgotPassword';

import RegisterComponent from './components/RegisterComponent';
import  { Auth } from 'aws-amplify';
import './../../amplify_config';


//Api



//Styles

//const
const FormItem = Form.Item;

class LoginPage extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      username: '',
      password: '',
      register: false,
      login: true,
      confirmation: false,
      errors: {},
      touched: {},
      fullname: '',
      forgotPassword: false,
      recovery: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true });
    Auth.signIn(this.state.username, this.state.password)
        .then(user => {
        console.log(user);
        this.setState({ loading: false});
          
          setTimeout(function() {
            window.location.reload()
            this.props.history.push(`/dashboard`)
          }, 2000)
    })
      .catch(err => {
        console.log('err',err);
        this.setState({ loading: false });
      });
  };
  
  handleChange = async event => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    await this.setState({ [name]: value })
  };
  
  render() {
    const { username, password } = this.state
    return (
      <div>
        <div className="bg-login">
          <div className='logo-login'>
            <Avatar src={'http://traestodo.com/traestodo17/assets/img/logo/logo-traestodo.png'} shape={'square'} size={100}/>
          </div>
          
          {this.state.login && (
            <Card title="Login" style={{ width: '100%' }}>
              <Form className="login-form">
                <FormItem label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}  />}  name={'username'} value={username} onChange={this.handleChange}  placeholder="Username"  />
                </FormItem>
                <FormItem label="Password" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" name={'password'} placeholder="Password" value={password} onChange={this.handleChange}/>
                </FormItem>
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="button" className="btn-link" onClick={_ =>this.setState({ forgotPassword: true, login: false })}>Olvidó su contraseña</Button>
                  <Button type="primary" className="login-form-button" onClick={this.handleSubmit}>Iniciar sesión</Button>
                  
                  <Button type="button" className="btn-link" onClick={_ => this.setState({ register: true, login: false })}>Registrarse</Button>
                  <Button type="button" className="btn-link" onClick={_ => this.setState({ confirmation: true, login: false })}>Confirmar cuenta</Button>
                
                </FormItem>
              </Form>
            </Card>
          )}
          {this.state.forgotPassword && (
            <ForgotPassword
              actionForgot={_ => this.setState({ forgotPassword: false, recovery: true })}
              actionChangeState={_ => this.setState({ login: true, register: false, confirmation: false, forgotPassword: false })}
            />
          )}
          {this.state.confirmation && (
            <ConfirmationAccount
              actionConfirm={_ => this.setState({ login: true, confirmation: false })}
              actionChangeState={_ => this.setState({ login: true, register: false, confirmation: false })}
            />
          )}
          {this.state.register && (
            <RegisterComponent
              actionRegister={_ => this.setState({ confirmation: true, register: false })}
              actionChangeState={_ => this.setState({ login: true, register: false, confirmation: false })}
            />
          )}
        
        </div>
      </div>
    );
  }
}

const WrappedCreateForm = Form.create()(LoginPage);
export default withRouter(WrappedCreateForm)