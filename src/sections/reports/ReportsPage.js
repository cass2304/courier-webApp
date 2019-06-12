//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Api
import ReportSrc from '../reports/ReportsSrc';

//Components
import UIDateSelect from '../../commons/components/UIDateSelect';
import UIIntegerInput from '../../commons/components/UIIntegerInput';
import ClientSearchSelect from '../clients/components/ClientSearchSelect';
import ResumeTable from './components/ResumenTable';
import {
  Form,
  DatePicker,
  Divider,
  Statistic,
  Input,
  Select,
  Button,
  Card,
  Col,
  Row,
  message
} from 'antd';

//Styles

//const
const FormItem = Form.Item;
const Option = Select.Option;

class ReportsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      radioValue: 'today',
      dateRange: null,
      type: 'CIERRE',
      data:[],
      loading: false,
      errors: {}
    }

    this.onSearch = this.onSearch.bind(this)
  }

  onSearch = async () => {
    console.log('asdasdasds')
    try {

      await this.validateFields();
      this.setState({ loading: true });

      let params = {
        total: this.state.type === 'CIERRE' ? true : false,
        date: this.state.date.format('YYYY-MM-DD')
      };

      const counts = await ReportSrc.totals(params)
      const data = await ReportSrc.closedReport(params)

      this.setState({ counters: counts[0], data: data, loading: false })

    } catch (e) {
      console.log(e);
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false });
    }
  }

  validateFields = async() => {
    try {
      let errors = {}
      if(!this.state.date) {
        errors.date = 'La fecha es requerida'
      }

      this.setState({ errors });
      if (Object.keys(errors).length > 0)
        throw errors

      return false
    } catch (errors) {
      console.log(errors)
      throw errors
    }
  };

  handleChange = (name, value) => {

    let otherState = {}

    if(name === 'client' && value) {
      this.searchClient(value)
      otherState = { client_id : undefined }
    }

    if(name === 'client_id') {
      otherState = {
        client: undefined,
        client_data: undefined
      }
    }

    this.setState({ [name]: value, ...otherState })
  }

/*
  searchClient = async client_id => {

    try {

      await this.setState({ clientLoading: true });

      let client = await ClientsSrc.getByClientId(client_id);

      await this.setState({ clientLoading: false, client_data: client[0] });

      this.handleBlur()

    } catch (e) {
      this.setState({ clientLoading: false });
      message.error(e);
    }
  }*/


  render() {

    const {
      dateRange,
      client_id,
      client,
      type,
      date,
      counters,
      data,
      loading,
      errors
    } = this.state;

    return (
      <div>
        <div className={'table-action-bar'}>
          <h2>Reportes</h2>
        </div>
        <Form>
          <Card>
            <Row>
              <Col span={12}>
                <FormItem label='Tipo de Reporte' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Select
                    placeholder='Seleccione'
                    onChange={value => this.handleChange('type', value)}
                    value={type}
                    defaultValue={type}
                  >
                    <Option value='GENERAL'>General</Option>
                    <Option value='CIERRE'>Cierre</Option>
                  </Select>
                </FormItem>
              </Col>
              {this.state.type === 'GENERAL' &&
              <div>
                <Col span={12}>
                  <FormItem
                    label='Fecha'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <UIDateSelect
                      onChange={value => this.handleChange('dateRange', value)}
                      value={dateRange}
                      placeholder={'Fecha'}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Cod. Cliente' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <UIIntegerInput
                      onBlur={this.handleBlur}
                      onChange={e => this.handleChange('client_id', e.target.value)}
                      value={client_id}
                      placeholder='Cod. Cliente'
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Nombre Cliente' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <ClientSearchSelect
                      value={client}
                      onChange={value => this.handleChange('client', value)}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Nro. Tracking' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Input placeholder={'Nro. Tracking'} />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Estado' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Select placeholder='Seleccione'>
                      <Option value='registrado'>Registrado</Option>
                      <Option value='transito'>En transito guatemala</Option>
                      <Option value='recibidofi'>Recibido en oficina</Option>
                      <Option value='ruta'>En ruta</Option>
                      <Option value='entregado'>Entregado</Option>
                      <Option value='tba'>TBA</Option>
                    </Select>
                  </FormItem>
                </Col>
              </div>
              }
              
              {this.state.type === 'CIERRE' &&
                <Col span={12}>
                  <FormItem
                    label='Fecha'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 12 }}
                    required
                    validateStatus={errors.date && 'error'}
                    help={errors.date}
                  >
                    <DatePicker 
                      placeholder='Seleccione una Fecha'
                      onChange={value => this.handleChange('date', value)}
                      value={date} style={{ width: '300px'}}
                    />
                  </FormItem>
                </Col>
              }
            </Row>
          </Card>

          <br/>

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Form.Item>
                <Button type='primary' onClick={this.onSearch} loading={loading} >
                  Buscar
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
        <Divider/>
        {counters  &&
          <div style={{ textAlign: 'center' }}>
            <Row gutter={24}>
              <Col span={8}>
                <Statistic title='Total de Paquetes' value={ counters.tota_paquetes || 0 } />
              </Col>
              <Col span={8}>
                <Statistic title='Total de Libras' value={ counters.total_libras || 0 } />
              </Col>
              <Col span={8}>
                <Statistic title='Total de Cobrado' value={Accounting.formatMoney(counters.total_cobrado || 0, 'Q')} />
              </Col>
            </Row>
            <ResumeTable
              loading={this.state.loading}
              packages={data}
            />
          </div>
        }
      </div>
    )
  }
}

export default withRouter(ReportsPage)
