import React, { Component } from 'react'
import PageTitle from '@/components/PageTitle'
import { Form, Input, Radio, message, Checkbox, Row, Col, Select, Button, InputNumber } from 'antd';
import * as Fetch from '@/libs/fetch';
// import SimpleMDE from 'simplemde'
// import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
// import 'simplemde/dist/simplemde.min.css';
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import './essay.less'
import './markdown.less'
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
    Fetch.get(`essay/detail/${this.state.id}`).then((res) => {
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
    Fetch.get(`category/findAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					categoryList: res.data
				})
			}
		})
  }

  getTagList () {
    Fetch.get(`tag/findAll`).then((res) => {
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
          this.inArrayIndexOf(categorys, category.name) && _categorys.push(category)
        }

        values = Object.assign(this.state.essayData, values, {
          tags: _tags,
          categorys: _categorys,
          content: this.mdEditor.getHtmlValue()
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
			} else {
        message.success(res.msg)
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
          <Form.Item label="类型">
            {getFieldDecorator('categorys', { 
              rules: [
                {
                  required: true,
                  message: '请至少选择一个类型',
                }
              ],
              initialValue: essayData.categorys
            })(
              <Select mode="multiple"placeholder="选择类型" optionLabelProp="label">
              {
                categoryList.map((c) => {
                  return (
                    <Option key={c.id} value={c.name} label={c.name}>{c.name}</Option>
                  )
                })
              }
              </Select>
            )}
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