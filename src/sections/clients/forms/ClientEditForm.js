import React from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Select, Button, Radio, Switch , Card, message } from 'antd';
import { utilChange, verifyEmail, verifyPassword } from '../../../config/util';

import ClientsSrc from '../ClientsSrc';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ClientsEditForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tipo: 'cliente',
			errors: {}
		};
		this.onSave = this.onSave.bind(this);
		this.loadProfile = this.loadProfile.bind(this);
	}

	loadProfile = async() => {
		this.setState({ loading: true })
		ClientsSrc.getProfile().then(
			profile => {
				this.setState({
					user_id:profile[0].user_id,
					client_id:profile[0].client_id,
					email:profile[0].email,
					name:profile[0].name,
					phone:profile[0].phone,
					nit:profile[0].nit,
					entrega:profile[0].entrega,
					main_address:profile[0].main_address,
					message_user:profile[0].message_user,
					cuota:profile[0].cuota,
					type:profile[0].type
				});
				this.setState({ loading: false });
			}
		)
	};

	componentDidMount(){
		this.loadProfile();
	}

	onSave = async(e) => {
		try {
			e.preventDefault()
			this.setState({ loading: true })
			await this.validateFields()

			let _users = {
				client_id: this.state.client_id,
				type: this.state.type,
				name: this.state.name,
				email: this.state.email,
				nit: this.state.nit,
				phone: this.state.phone,
				main_address: this.state.main_address,
				entrega: this.state.entrega,
				message_user: this.state.message_user
			};
			await ClientsSrc.update(_users,this.state.user_id);
			message.success('Registro actualizado');
			this.loadProfile();
			return this.setState({ loading: false });

		} catch (e) {
			console.log(e)
			if (e && e.message) {
				message.error(e.message);
			}
			this.setState({ loading: false })
		}
	};

	validateFields = async() => {
		try {
			let errors = {}
				if(!this.state.name) {
					errors.name = 'El nombre es requerido'
				}
				if(!this.state.phone) {
				  errors.phone = 'El numero de telefono es requerido'
				}
				this.setState({ errors });
				if (Object.keys(errors).length > 0)
					throw errors

				return false
		} catch (errors) {
			throw errors
		}
	};

	onBack = () => {
		this.props.history.push('/clients');
	};

	handleChange = event => {
		utilChange(event, (name, value) => {
			this.setState({ [name]: value })
		});
	};

	handleSelectTarifaChange = (value) => {
		this.setState({tarifa: value });
	};

	onPreferencesChanged = (e) => {
		this.setState({entrega: e.target.value });
	};

	onActivoChanged = (value) => {
		this.setState({activo: value });
	};

	render() {

		const { errors, loading, client_id, email, name, phone, nit, entrega, main_address, message_user, cuota, type } = this.state;
		return (
			<div>
				<Card title="Editar" style={{ width: '100%' }} loading={loading}>
					<Form>
						<FormItem
							label="Codigo Cliente" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								name="client_id"
								value={client_id}
								disabled
							/>
						</FormItem>
						<FormItem
							label="Email" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								name="email"
								value={email}
								disabled
							/>
						</FormItem>
						<FormItem
							required
							validateStatus={errors.name && 'error'}
							help={errors.name}
							label="Nombre" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								name="name"
								onChange={this.handleChange}
								value={name}
								disabled={loading}
							/>
						</FormItem>

						<div className={type !== 'cliente' ? 'hidden' : ''}>
						 <FormItem
							 required
							 validateStatus={errors.phone && 'error'}
							 help={errors.phone}
							 label="Numero de telefono" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							 <Input
								 name="phone"
								 onChange={this.handleChange}
								 value={phone}
								 disabled={loading}
							 />
						 </FormItem>
						 <FormItem label = "Nit" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							 <Input
								 name="nit"
								 onChange={this.handleChange}
								 value={nit}
								 disabled={loading}
							 />
						 </FormItem>
						 <FormItem label="Preferencia de entrega" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							 <RadioGroup>
								 <Radio
									 value="Entrega en Traestodo"
									 checked={entrega === "Entrega en Traestodo"}
									 onChange={this.onPreferencesChanged}
									 disabled={loading}
								 >TraesTodo</Radio>
								 <Radio
									 value="Entrega a Domicilio"
									 checked={entrega === "Entrega a Domicilio"}
									 onChange={this.onPreferencesChanged}
									 disabled={loading}
								 >Domicilio</Radio>
							 </RadioGroup>
						 </FormItem>
						 <FormItem label="Direccion de entrega" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							 <Input
								 name="main_address"
								 onChange={this.handleChange}
								 value={main_address}
								 disabled={loading}
							 />
						 </FormItem>
						 <FormItem label="Observaciones" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							 <Input
								 name="message_user"
								 onChange={this.handleChange}
								 value={message_user}
								 disabled={loading}
							 />
						 </FormItem>
						 </div>

						<FormItem label="Tarifa Q" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								name="cuota"
								value={cuota}
								disabled
							/>
						</FormItem>

						{/*<FormItem label="Tarifa" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Select placeholder="Selecciona tarifa"
							        name="tarifa"
							        onChange={this.handleSelectTarifaChange}
							        value={this.state.tarifa}
							        disabled={loading}
							>
								<Option value="normal">Q60 (Normal)</Option>
								<Option value="cc">Q56 (CC)</Option>
								<Option value="vip">Q55 (Vip)</Option>
								<Option value="c">Q50 (C)</Option>
							</Select>
						</FormItem>

						<FormItem label="Activo" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Switch
								name="activo"
								checked={this.state.data.activo === 'Y'}
								onChange={this.onActivoChanged}
								disabled={loading}
							/>
						</FormItem>*/}

						<FormItem wrapperCol={{ span: 6, offset: 9 }}>
							<Button type="primary" loading={loading} onClick={this.onSave}>Guardar</Button>
							<Button type="danger" className="btn-separator" onClick={this.onBack}>Regresar</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
		);
	}
}

const WrappedCreateForm = Form.create()(ClientsEditForm);
export default withRouter(WrappedCreateForm)
