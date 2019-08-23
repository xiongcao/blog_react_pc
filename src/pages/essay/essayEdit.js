import React, { Component, Fragment } from 'react'
import PageTitle from '@/components/PageTitle'
import { Form, Input, Radio, message, Checkbox, Row, Col, Select, Button, InputNumber } from 'antd';
import { api, oss } from '@/libs/publicPath.js'
import UploadImage from '@/components/UploadImage'
import * as Fetch from '@/libs/fetch';

// import SimpleMDE from 'simplemde'
// import 'simplemde/dist/simplemde.min.css';
// import marked from 'marked'

import hljs from 'highlight.js'

import 'highlight.js/styles/atom-one-light.css'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import './essay.less'
import '@/assets/styles/markdown.less'
const { Option } = Select;

class EssayEdit extends Component {
  mdParser = null

  constructor(props){
    super(props)
    this.state = {
      essayData: {
        content: '',
        rank: 0,
        status: 1
      },
      categoryList: [],
      tagList: [],
      id: props.match.params.id,
    }

    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }    
        return ''
      }
    })
  }

  componentDidMount () {
		this.getCategoryList()
    this.getTagList()
    Number(this.state.id) !== -1 && this.getEssayDetail()
  }

  getEssayDetail () {
    Fetch.get(`essay/admin/detail/${this.state.id}`).then((res) => {
			if (res.code === 0) {
        let tags = res.data.tags.map((tag) => tag.name)
        let categorys = res.data.categorys.map((category) => category.name)
        let essayData = Object.assign({}, res.data, {
          categorys, tags
        })
				this.setState({
					essayData
				})
			}
		})
  }
  
  getCategoryList () {
    Fetch.get(`category/findAll?status=1`).then((res) => {
			if (res.code === 0) {
				this.setState({
					categoryList: res.data
				})
			}
		})
  }

  getTagList () {
    Fetch.get(`tag/findAll?status=1`).then((res) => {
			if (res.code === 0) {
				this.setState({
					tagList: res.data
				})
			}
		})
  }

  handleSubmit = (e) => {
    e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Number(this.state.id) !== -1 && (values.id = this.state.id)
        let { tags, categorys } = values
        let _tags = [], _categorys = []

        let tagList = [...this.state.tagList]
        for (let i = 0; i < tagList.length; i++) {
          let tag = tagList[i]
          this.inArrayIndexOf(tags, tag.name) && _tags.push(tag)
        }

        let categoryList = [...this.state.categoryList]
        for (let i = 0; i < categoryList.length; i++) {
          let category = categoryList[i]
          this.inArrayIndexOf([categorys], category.name) && _categorys.push(category)
        }

        values = Object.assign(this.state.essayData, values, {
          tags: _tags,
          categorys: _categorys,
          // content: this.mdEditor.getHtmlValue()
          content: this.mdEditor.getMdValue()
        })

        console.log(values, 'values')
        this.saveEssay(values)
      }
    })
  }

  saveEssay = (data) => {
    Fetch.post(`essay/save`, data).then((res) => {
			if (res.code === 0) {
        message.success("成功")
        setTimeout(() => {
          this.props.history.push({pathname: '/admin/essay/essayList'})
        }, 800)
			}
		})
  }

  inArrayIndexOf = (arr, str) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        return arr[i]
      }
    }
  }

  handleImageUpload = (file, callback) => {
    const reader = new FileReader()
    reader.onload = () => {      
      const convertBase64UrlToBlob = (urlData) => {  
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type:mime})
      }
      const blob = convertBase64UrlToBlob(reader.result)
      const formData = new FormData()
      formData.append('file', file)
      Fetch.post(`file/essay`, formData, {}).then((res) => {
        if (res.code === 0) {
          callback(`${oss}${res.data}`)
        }
      })
    }
    reader.readAsDataURL(file)
  }

  uploadSuccess = (cover) => {
		this.props.form.setFieldsValue({
			cover
		})
	}

  render() {
    let { tagList, categoryList, essayData } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 1,
          offset: 2,
        },
      }
		};
		const { getFieldDecorator } = this.props.form;
    return (
      <div className="essayEdit">
        <PageTitle>文章管理</PageTitle>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="封面">
            {
              getFieldDecorator('cover')(
                <Fragment>
                  <Input hidden/>
                  <UploadImage imagePath={essayData.cover} folder={'essay_cover'} uploadSuccess={this.uploadSuccess.bind()} />
                </Fragment>
              )
            }
          </Form.Item>
          <Form.Item label="标题">
            {
              getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  }
                ],
                initialValue: essayData.title
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label="类型">
            {getFieldDecorator('categorys', { 
              rules: [
                {
                  required: true,
                  message: '请选择类型',
                }
              ],
              initialValue: essayData.categorys && essayData.categorys[0]
            })(
              <Select placeholder="选择类型" optionLabelProp="label" showSearch>
              {
                categoryList.map((c, i) => {
                  return (
                    <Option key={i} value={c.name} label={c.name}>{c.name}</Option>
                  )
                })
              }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="标签">
            {getFieldDecorator('tags', { 
              rules: [
                {
                  required: true,
                  message: '请至少选择一个标签',
                }
              ],
              initialValue: essayData.tags
            })(
              <Select mode="multiple" placeholder="选择标签" optionLabelProp="label">
              {
                tagList.map((tag) => {
                  return (
                    <Option key={tag.id} value={tag.name} label={tag.name}>{tag.name}</Option>
                  )
                })
              }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="描述">
            {
              getFieldDecorator('des', {
                rules: [
                  {
                    required: true,
                    message: '请输入描述',
                  }
                ],
                initialValue: essayData.des
              })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }}/>)
            }
          </Form.Item>
          <Form.Item label="序号">
            {
              getFieldDecorator('rank', { 
                initialValue: essayData.rank
              })(<InputNumber min={0} style={{ width: '100%' }}/>)
            }
          </Form.Item>
          <Form.Item label="状态">
            {
              getFieldDecorator('status', {
                initialValue: essayData.status
              })(
                <Radio.Group>
                  <Radio value={1}>公开</Radio>
                  <Radio value={2}>私密</Radio>
                  <Radio value={3}>草稿</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          {/* <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} /> */}
          <Row>
            <Col offset={2}>
              <MdEditor
                ref={node => this.mdEditor = node}
                style={{height: 500}}
                value={essayData.content + ''}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: false
                  }
                }}
                renderHTML={(text) => this.mdParser.render(text)}
                onImageUpload={this.handleImageUpload}
              />
            </Col>
          </Row>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'essay' })(EssayEdit)