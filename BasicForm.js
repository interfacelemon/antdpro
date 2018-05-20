import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  Checkbox,
  Tree
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditForm from './editForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;

const flex = {
  display: 'flex',
  justifyContent: 'start',
  alignItem: 'start',
  flexDirection: 'row',
}

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    visible: true,
    area: 'table',
    defaultCheckedKeys: ['1'],
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values, moment(values.date[0]).format('YYYY-MM-DD'));
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  handleVisible = () => {
    this.setState({
      visible: !this.state.visible
    });
  };
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0`, children: [
            {
              title: '自动加1',
              key: `${treeNode.props.eventKey}-0-0`,
              isLeaf: true
            }, {
              title: '自动加2',
              key: `${treeNode.props.eventKey}-1-1`,
              isLeaf: true
            }
          ] },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        }, () => {
          console.log(81, this.state.treeData);
        });
        resolve();
      }, 1000);
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };
  changeBackground = (area) => {
    this.setState({
      area,
      defaultCheckedKeys: []
    }, () => {
      console.log(this.state.defaultCheckedKeys);
      this.setState({
        defaultCheckedKeys: this.state[`${this.state.area}defaultCheckedKeys`]
      });
    });
  };
  onSelect = (selectedKeys, e) => {
    // console.log(115, selectedKeys, e);
  };
  onCheck = (checkedKeys, e) => {
    console.log(118, checkedKeys, e);
    this.setState({
      [`${this.state.area}defaultCheckedKeys`]: checkedKeys,
      defaultCheckedKeys: checkedKeys
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="基础表单"
        content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              })(<Input placeholder="给目标起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="起止日期">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
                initialValue: [moment('2015-06-06', 'YYYY-MM-DD'), moment('2015-07-06', 'YYYY-MM-DD')]
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="目标描述">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: '请输入目标描述',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入你的阶段性工作目标"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="衡量标准">
              {getFieldDecorator('standard', {
                rules: [
                  {
                    required: true,
                    message: '请输入衡量标准',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入衡量标准" rows={4} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  客户
                  <em className={styles.optional}>
                    （选填）
                    <Tooltip title="目标的服务对象">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  邀评人<em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <Input placeholder="请直接 @姓名／工号，最多可邀请 5 人" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  权重<em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('weight')(<InputNumber placeholder="请输入" min={0} max={100} />)}
              <span>%</span>
            </FormItem>
            <FormItem {...formItemLayout} label="目标公开" help="客户、邀评人默认被分享">
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">公开</Radio>
                    <Radio value="2">部分公开</Radio>
                    <Radio value="3">不公开</Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder="公开给"
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">同事甲</Option>
                      <Option value="2">同事乙</Option>
                      <Option value="3">同事丙</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
          <Button type='primary' onClick={this.handleVisible}>弹窗</Button>
        </Card>
        <Modal width='60%' title='树形' visible={this.state.visible} onOk={this.handleVisible} onCancel={this.handleVisible}>
          <div style={{...flex}}>
            <div style={{flexGrow: 1}}>
              <div onClick={() => this.changeBackground('table')} style={{padding: '30px 0', backgroundColor: this.state.area==='table' ? '#eee' : '#fff'}}>
                <Checkbox>表格</Checkbox>
              </div>
              <div onClick={() => this.changeBackground('line')} style={{padding: '30px 0', backgroundColor: this.state.area==='line' ? '#eee' : '#fff'}}>
                <Checkbox>线图</Checkbox>
              </div>
              <div onClick={() => this.changeBackground('pie')} style={{padding: '30px 0', backgroundColor: this.state.area==='pie' ? '#eee' : '#fff'}}>
                <Checkbox>饼图</Checkbox>
              </div>
              <div onClick={() => this.changeBackground('interval')} style={{padding: '30px 0', backgroundColor: this.state.area==='interval' ? '#eee' : '#fff'}}>
                <Checkbox>柱状</Checkbox>
              </div>
            </div>
            <div style={{flexGrow: 1, backgroundColor: '#eee'}}>
              <Tree checkedKeys={this.state.defaultCheckedKeys} defaultCheckedKeys={this.state.defaultCheckedKeys} checkable loadData={this.onLoadData} onCheck={this.onCheck} onSelect={this.onSelect}>
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
