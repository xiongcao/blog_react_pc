import React, { Component } from 'react'
import PageTitle from '@/components/PageTitle'
import { Form, Input, Radio, message, Checkbox, Row, Col, Button } from 'antd';
import * as Fetch from '@/libs/fetch';
import SimpleMDE from 'simplemde'
import marked from 'marked'
import highlight from 'highlight.js'
import 'simplemde/dist/simplemde.min.css';
import './essay.less'
import './markdown.less'

class EssayEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      categoryForm: {},
      categoryList: [],
      tagList: [],
      id: props.match.params.id,
    }
  }

  componentDidMount () {
		this.getCategoryList()
    this.getTagList()
    
    this.state.smde = new SimpleMDE({
			element: document.getElementById('editor').childElementCount,
			autofocus: true,
			autosave: true,
			previewRender(plainText) {
				return marked(plainText, {
					renderer: new marked.Renderer(),
					gfm: true,
					pedantic: false,
					sanitize: false,
					tables: true,
					breaks: true,
					smartLists: true,
					smartypants: true,
					highlight(code) {
						return highlight.highlightAuto(code).value;
					},
				});
			},
		});
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
      console.log(values, 'values')
    })
  }

  render() {
    let { tagList, categoryList } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 12 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 1,
          offset: 4,
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
                ]
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label="标签">
            {getFieldDecorator('tagId', { 
              rules: [
                {
                  required: true,
                  message: '请至少选择一个标签',
                }
              ],
              initialValue: []
            })(
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  {
                    tagList.map((tag) => {
                      return (
                        <Checkbox key={tag.id} value={tag.id}>{tag.name}</Checkbox>
                      )
                    })
                  }
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item label="类型">
            {getFieldDecorator('categoryId', { 
              rules: [
                {
                  required: true,
                  message: '请至少选择一个类型',
                }
              ],
              initialValue: []
            })(
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  {
                    categoryList.map((c) => {
                      return (
                        <Checkbox key={c.id} value={c.id}>{c.name}</Checkbox>
                      )
                    })
                  }
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item label="文章">
            <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} />
          </Form.Item>
          <Form.Item label="序号">
            {
              getFieldDecorator('rank', {
                rules: [
                  {
                    validator: this.validateRank,
                  }
                ]
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label="状态">
            {
              getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={1}>公开</Radio>
                  <Radio value={2}>私密</Radio>
                  <Radio value={3}>草稿</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'essay' })(EssayEdit)