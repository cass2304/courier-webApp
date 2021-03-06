//Libs
import React from 'react';
import { withRouter } from 'react-router';

//Components
import {
  Table,
  Button
} from 'antd';

class PackagesTable extends React.Component {

  constructor(props){
    super(props);

    this.getColumns = this.getColumns.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      data: [],
      isPageTween: false,
      loading: false,
      hasMore: true,
    };
  }

  getColumns = ()=>{
    let columns = [
      { title: 'Tracking', dataIndex: 'tracking', key: 'tracking' },
      { title: 'Fecha Registro', dataIndex: 'ing_date', key: 'ing_date' },
      { title: 'Estado', dataIndex: 'status', key: 'status' },
      {
        title: 'Accion',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
              <Button type='default' icon='edit' onClick={(e) => { this.onEdit(record.key, e); }}/>
              <Button type='danger' icon='delete' onClick={(e) => { this.onDelete(record.key, e); }}/>
          </span>
        ),
      },
    ];

    return columns
  }

  getData = data => data.map(d => ({

    key: d.package_id,
    tracking: d.tracking,
    ing_date: d.ing_date,
    status: d.status
  }));

  onDelete = (key, e) => {
    e.preventDefault();
    const data = this.state.data.filter(item => item.key !== key);
    this.setState({ data, isPageTween: false });
  };

  onEdit = (key, e) => {

  };

  render() {
    return (
      <div>
        <Table
          loading={this.props.loading}
          columns={this.getColumns()}
          dataSource={this.getData(this.props.packages)}
        />
      </div>
    );
  }
}

export default withRouter(PackagesTable)
