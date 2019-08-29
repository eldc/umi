import * as React from 'react';
import ReactDOM from 'react-dom';
import TweenOne from 'rc-tween-one';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  Button,
  Tooltip,
  Card,
  Skeleton,
  Typography,
  Badge,
  Tag,
  Spin,
  Popconfirm,
  Row,
  ConfigProvider,
  Col,
  message,
  Layout,
  Empty,
} from 'antd';
import { Export, AppstoreFilled, Edit, Delete } from '@ant-design/icons';
// TODO from server
import umiIconSvg from '@/assets/umi.svg';
import bigfishIconSvg from '@/assets/bigfish.svg';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { setCurrentProject, openInEditor, editProject, deleteProject } from '@/services/project';
import ProjectContext from '@/layouts/ProjectContext';
import Loading from '@/pages/loading';
import ModalForm from './ModalForm';
import { IProjectItem } from '@/enums';
import { getProjectStatus, sortProjectList, handleBack } from '@/utils';
import { IProjectProps } from '../index';

import styles from './index.less';

const { Sider, Content } = Layout;
const { Meta } = Card;
const { Paragraph } = Typography;
const { useState, useContext, useMemo } = React;

type IAction = 'editor' | 'open' | 'edit' | 'delete' | 'progress';
interface IProjectListItem extends IProjectItem {
  key: string;
}

const ProjectList: React.SFC<IProjectProps> = props => {
  const _log = g_uiDebug.extend('projectList');
  const iconSvg = window.g_bigfish ? bigfishIconSvg : umiIconSvg;
  const { projectList } = props;
  const { currentProject, projectsByKey = {} } = projectList;
  const { setCurrent } = useContext(ProjectContext);
  const [initialValues, setInitiaValues] = useState({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const isProgress = (item: IProjectListItem) => {
    if (get(item, 'creatingProgress.success')) return false;
    return !!item.creatingProgress;
  };

  _log('projectList', projectList);

  const loading = !projectList.projectsByKey;
  _log('loading', loading);

  const projects = useMemo(
    () => {
      const projectListMap = Object.keys(projectsByKey).map(key => {
        const created_at = get(
          projectsByKey,
          `${key}.created_at`,
          new Date('2002').getTime(),
        ) as number;
        return {
          ...projectsByKey[key],
          key,
          active: key === currentProject,
          created_at,
        };
      });
      return sortProjectList(projectListMap);
    },
    [projectList],
  );

  const handleOnAction = async (action: IAction, payload: { key?: string; [key: string]: any }) => {
    if (action === 'open') {
      await setCurrentProject(payload as any);
      await handleBack(true, '/dashboard');
      // for flash dashboard
      document.getElementById('root').innerHTML = '';
      ReactDOM.render(React.createElement(<Loading />, {}), document.getElementById('root'));
    }
    if (action === 'delete') {
      await deleteProject(payload);
      message.success('删除成功');
    }
    if (action === 'editor') {
      try {
        await openInEditor(payload);
      } catch (e) {
        message.error(e && e.message ? e.message : '编辑器打开失败');
      }
    }
    if (action === 'edit') {
      setModalVisible(true);
      setInitiaValues(payload);
    }
    // onProgress
    if (action === 'progress') {
      setCurrent('progress', payload);
    }
  };

  const handleTitleClick = async (item: IProjectListItem) => {
    if (isProgress(item)) {
      await handleOnAction('progress', { key: item.key });
    } else {
      await handleOnAction('open', { key: item.key });
    }
  };

  const actionsMap: { [key: string]: (item: IProjectItem) => React.ReactNode[] } = {
    progress: item => [
      <p style={{ cursor: 'auto' }}>
        <Spin style={{ marginRight: 8 }} />
        {formatMessage({ id: 'org.umi.ui.global.project.list.creating' })}
      </p>,
    ],
    failure: item => [],
    success: item => [
      <Tooltip title={formatMessage({ id: 'org.umi.ui.global.project.editor.open' })}>
        <a
          onClick={e => {
            e.stopPropagation();
            handleOnAction('editor', { key: item.key });
          }}
        >
          <Export className={styles.exportIcon} />
        </a>
      </Tooltip>,
      <Tooltip title={formatMessage({ id: 'org.umi.ui.global.project.list.edit.name' })}>
        <a
          onClick={e => {
            e.stopPropagation();
            handleOnAction('edit', { key: item.key, name: item.name });
          }}
        >
          <Edit />
        </a>
      </Tooltip>,
    ],
  };

  const renderItem = item => {
    const status = getProjectStatus(item);
    const actions = (actionsMap[status] ? actionsMap[status](item) : []).concat(
      <div onClick={e => e.stopPropagation()}>
        <Tooltip title={formatMessage({ id: 'org.umi.ui.global.project.list.delete' })}>
          <Popconfirm
            title={formatMessage({ id: 'org.umi.ui.global.project.list.delete.confirm' })}
            onConfirm={() => {
              handleOnAction('delete', { key: item.key });
            }}
            onCancel={() => {}}
            okText={formatMessage({ id: 'org.umi.ui.global.okText' })}
            cancelText={formatMessage({ id: 'org.umi.ui.global.cancelText' })}
          >
            <a>
              <Delete />
            </a>
          </Popconfirm>
        </Tooltip>
      </div>,
    );

    return (
      <Col key={item.key} className={styles['project-list-item']} md={12} lg={8} xl={6}>
        <Card actions={actions} onClick={() => handleTitleClick(item)}>
          <Meta
            title={
              <div className={styles['project-list-item-title']}>
                {item.key === currentProject && <Badge status="success" />}
                <a>{item.name}</a>
                {status === 'progress' && (
                  <Tag className={`${styles.tag} ${styles['tag-progress']}`}>
                    {formatMessage({
                      id: 'org.umi.ui.global.project.list.create.loading',
                    })}
                  </Tag>
                )}
                {status === 'failure' && (
                  <Tag className={`${styles.tag} ${styles['tag-error']}`}>
                    {formatMessage({
                      id: 'org.umi.ui.global.project.list.create.error',
                    })}
                  </Tag>
                )}
              </div>
            }
            description={
              <Paragraph
                className={styles['project-list-item-desc']}
                style={{ marginBottom: 0 }}
                ellipsis={{ rows: 3, expandable: true }}
              >
                {item.path}
              </Paragraph>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <Layout className={styles['project-list-layout']}>
      <Sider theme="dark" trigger={null} width={72} className={styles['project-list-layout-sider']}>
        <div className={styles['project-list-layout-sider-title']}>
          <img src={iconSvg} alt="logo" />
          <h1>{window.g_bigfish ? 'Bigfish' : 'Umi'} UI</h1>
        </div>
        <div className={styles['project-list-layout-sider-item']}>
          <AppstoreFilled />
          <p>{formatMessage({ id: 'org.umi.ui.global.project.siderbar.title' })}</p>
        </div>
      </Sider>
      <Content className={styles['project-list-layout-content']}>
        <Row
          type="flex"
          justify="space-between"
          className={styles['project-list-layout-content-header']}
        >
          <Col>
            <h2 className={styles['project-title']}>
              {formatMessage({
                id: 'org.umi.ui.global.project.list.title',
              })}
            </h2>
          </Col>
          <Col>
            <div className={styles['project-action']}>
              <Button onClick={() => setCurrent('import')}>
                {formatMessage({
                  id: 'org.umi.ui.global.project.import.title',
                })}
              </Button>
              {window.g_bigfish ? null : (
                <Button type="primary" onClick={() => setCurrent('create')}>
                  {formatMessage({ id: 'org.umi.ui.global.project.create.title' })}
                </Button>
              )}
            </div>
          </Col>
        </Row>
        {projectList.projectsByKey && !projects.length ? (
          <Empty
            imageStyle={{
              height: 150,
              opacity: 0.1,
              marginBottom: 24,
              userSelect: 'none',
            }}
            style={{
              paddingTop: 187,
            }}
            image={iconSvg}
            description={formatMessage({ id: 'org.umi.ui.global.project.list.empty' })}
          />
        ) : loading ? (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row className={styles['project-list']} type="flex" gutter={24}>
            {projects.map((item, j) => renderItem(item))}
          </Row>
        )}
      </Content>
      <ModalForm
        onCancel={() => setModalVisible(false)}
        visible={modalVisible}
        restModelProps={{
          title: formatMessage({ id: 'org.umi.ui.global.project.list.edit.name' }),
          okText: formatMessage({ id: 'org.umi.ui.global.okText' }),
          cancelText: formatMessage({ id: 'org.umi.ui.global.cancelText' }),
        }}
        initialValues={initialValues}
        onOk={async (formKey, payload) => {
          setModalVisible(false);
          await editProject(payload);
          message.success(formatMessage({ id: 'org.umi.ui.global.edit.success' }));
        }}
      />
    </Layout>
  );
};

export default ProjectList;
