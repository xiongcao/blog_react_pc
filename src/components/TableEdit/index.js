import React, { Component } from 'react'
import { Input, Button, Icon } from 'antd';


class TableEdit extends Component {

  constructor(props){
    super(props)
    this.state = {
      inputShow: false,
      field: this.props.field,
      id: this.props.id,
      value: this.props.field
    }
  }

  edit = () => {
    this.setState({
      inputShow: !this.state.inputShow
    })
  }

  inputChange = (e) => {
    e.persist()
    this.setState({
      value: e.target.value
    })
  }

  cancel = () => {
    this.setState({
      inputShow: !this.state.inputShow,
      field: this.state.field
    })
  }

  confirm = (v) => {
    this.setState({
      inputShow: !this.state.inputShow,
      field: this.state.value
    }, () => {
      this.props.confirm(this.props.field, this.state.value, this.state.id)
    })
  }

  render() {
    let { field, inputShow } = this.state
    return (
      <>
        {
          inputShow ? (
            <div style={{minWidth: '150px',}}>
              <Input style={{minWidth: '90px', maxWidth: '220px', width: '60%'}} defaultValue={field} onChange={this.inputChange.bind(this)}/>
              <Icon type="close" style={{marginLeft: '8px', cursor: 'pointer'}} onClick={this.cancel.bind(this)}/>
              <Icon type="check" style={{marginLeft: '8px', cursor: 'pointer'}} onClick={this.confirm.bind(this)}/>
            </div>
          ) : (
            <>
              <span>{field} </span> 
              <Button type="link" icon="edit" onClick={this.edit.bind(this)}/>
            </>
          )
        }
      </>
    )
  }
}

export default TableEdit