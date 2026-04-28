import React, { Component } from 'react';
import DatabaseDataDisplay from './Tabs/DatabaseDataDisplay';
import PrebuiltQueriesDisplay from './Tabs/PrebuiltQueriesDisplay';
import NoNodeData from './Tabs/NoNodeData';
import UserNodeData from './Tabs/UserNodeData';
import GroupNodeData from './Tabs/GroupNodeData';
import ComputerNodeData from './Tabs/ComputerNodeData';
import DomainNodeData from './Tabs/DomainNodeData';
import GpoNodeData from './Tabs/GPONodeData';
import OuNodeData from './Tabs/OUNodeData';
import CaNodeData from './Tabs/CANodeData';
import TemplateNodeData from './Tabs/TemplateNodeData';
import AZGroupNodeData from './Tabs/AZGroupNodeData';
import AZUserNodeData from './Tabs/AZUserNodeData';
import AZKeyVaultNodeData from './Tabs/AZKeyVaultNodeData';
import AZResourceGroupNodeData from './Tabs/AZResourceGroupNodeData';
import AZDeviceNodeData from './Tabs/AZDeviceNodeData';
import AZSubscriptionNodeData from './Tabs/AZSubscriptionNodeData';
import AZTenantNodeData from './Tabs/AZTenantNodeData';
import AZVMNodeData from './Tabs/AZVMNodeData';
import AZServicePrincipalNodeData from './Tabs/AZServicePrincipal';
import AZAppNodeData from './Tabs/AZApp';
import { Tabs, Tab } from 'react-bootstrap';
import { openSync, readSync, closeSync } from 'fs';
import imageType from 'image-type';
import { withAlert } from 'react-alert';
import styles from './TabContainer.module.css';
import BaseNodeData from "./Tabs/BaseNodeData";
import ContainerNodeData from "./Tabs/ContainerNodeData";
import AZManagementGroupNodeData from "./Tabs/AZManagementGroupNodeData";
import AZRoleNodeData from "./Tabs/AZRoleNodeData";
import IPADomainNodeData from "./Tabs/IPADomainNodeData";
import IPAUserNodeData from "./Tabs/IPAUserNodeData";
import IPAComputerNodeData from "./Tabs/IPAComputerNodeData";
import IPAGroupNodeData from "./Tabs/IPAGroupNodeData";
import IPAServiceNodeData from "./Tabs/IPAServiceNodeData";
import IPACANodeData from "./Tabs/IPACANodeData";
import IPATemplateNodeData from "./Tabs/IPATemplateNodeData";
import IPAPermissionNodeData from "./Tabs/IPAPermissionNodeData";
import IPACanSUDOEdgeData from "./Tabs/IPACanSUDOEdgeData";
import IPARoleNodeData from "./Tabs/IPARoleNodeData";
import IPASELinuxNodeData from "./Tabs/IPASELinuxNodeData";


class TabContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baseVisible: false,
            userVisible: false,
            computerVisible: false,
            groupVisible: false,
            domainVisible: false,
            gpoVisible: false,
            ouVisible: false,
            caVisible: false,
            templateVisible: false,
            containerVisible: false,
            azGroupVisible: false,
            azUserVisible: false,
            azKeyVaultVisible: false,
            azResourceGroupVisible: false,
            azDeviceVisible: false,
            azSubscriptionVisible: false,
            azTenantVisible: false,
            azVMVisible: false,
            azServicePrincipalVisible: false,
            azAppVisible: false,
            azManagementGroupVisible: false,
            azRoleVisible: false,
            ipapermissionVisible: false,
            iparoleVisible: false,
            ipaselinuxVisible: false,
            ipadomainVisible: false,
            ipauserVisible: false,
            ipagroupVisible: false,
            ipaserviceVisible: false,
            ipacomputerVisible: false,
            ipacaVisible: false,
            ipatemplateVisible: false,
            ipacansudoVisible: false,
            selected: 1,
        };
    }

    clearVisible() {
        let temp = this.state;
        for (let key in temp) {
            if (key.includes('Visible'))
                temp[key] = false
        }

        this.setState(temp)
    }

    nodeClickHandler(type) {
        if (type === 'User') {
            this._userNodeClicked();
        } else if (type === 'Group') {
            this._groupNodeClicked();
        } else if (type === 'Computer') {
            this._computerNodeClicked();
        } else if (type === 'Domain') {
            this._domainNodeClicked();
        } else if (type === 'OU') {
            this._ouNodeClicked();
        } else if (type === 'CA') {
            this._caNodeClicked();
        } else if (type === 'CertificateTemplate') {
            this._templateNodeClicked();
        } else if (type === 'GPO') {
            this._gpoNodeClicked();
        } else if (type === 'AZGroup') {
            this._azGroupNodeClicked();
        } else if (type === 'AZUser') {
            this._azUserNodeClicked();
        } else if (type === 'AZKeyVault') {
            this._azKeyVaultNodeClicked();
        } else if (type === 'AZResourceGroup') {
            this._azResourceGroupNodeClicked();
        } else if (type === 'AZDevice') {
            this._azDeviceNodeClicked();
        } else if (type === 'AZSubscription') {
            this._azSubscriptionNodeClicked();
        } else if (type === 'AZTenant') {
            this._azTenantNodeClicked();
        } else if (type === 'AZVM') {
            this._azVMNodeClicked();
        } else if (type === 'AZServicePrincipal') {
            this._azServicePrincipalNodeClicked();
        } else if (type === 'AZApp') {
            this._azAppNodeClicked();
        } else if (type === 'Base') {
            this._baseNodeClicked();
        } else if (type === 'Container') {
            this._containerNodeClicked();
        } else if (type === 'AZManagementGroup') {
            this._azManagementGroupNodeClicked();
        } else if (type === 'AZRole') {
            this._azRoleNodeClicked();
        }
        else if (type === 'IPADomain') {
            this._ipadomainNodeClicked();
        }
        else if (type === 'IPAUser') {
            this._ipauserNodeClicked();
        }
        else if (type === 'IPAComputer') {
            this._ipacomputerNodeClicked();
        }
        else if (type === 'IPAGroup') {
            this._ipagroupNodeClicked();
        }
        else if (type === 'IPAPermission') {
            this._ipaPermissionNodeClicked();
        }
        else if (type === 'IPAService') {
            this._ipaServiceClicked();
        }
        else if (type === 'IPACA') {
            this._ipacaNodeClicked();
        }
        else if (type === 'IPACertificateTemplate') {
            this._ipatemplateNodeClicked();
        }
        else if (type === 'IPARole') {
            this._ipaRoleNodeClicked();
        }
        else if (type === 'IPASeLinux') {
            this._ipaSeLinuxNodeClicked();
        }
        else if (type === 'CanSUDO') {
            this._cansudoEdgeClicked();
        }
    }

    componentDidMount() {
        emitter.on('nodeClicked', this.nodeClickHandler.bind(this));
        emitter.on('imageupload', this.uploadImage.bind(this));
    }

    uploadImage(event) {
        let files = [];
        $.each(event.dataTransfer.files, (_, f) => {
            let buf = Buffer.alloc(12);
            let file = openSync(f.path, 'r');
            readSync(file, buf, 0, 12, 0);
            closeSync(file);
            let type = imageType(buf);
            if (type !== null && type.mime.includes('image')) {
                files.push({ path: f.path, name: f.name });
            } else {
                this.props.alert.info('{} is not an image'.format(f.name));
            }
        });
        emitter.emit('imageUploadFinal', files);
    }

    _baseNodeClicked() {
        this.clearVisible()
        this.setState({
            baseVisible: true,
            selected: 2
        });
    }

    _containerNodeClicked() {
        this.clearVisible()
        this.setState({
            containerVisible: true,
            selected: 2
        });
    }

    _userNodeClicked() {
        this.clearVisible()
        this.setState({
            userVisible: true,
            selected: 2
        });
    }

    _groupNodeClicked() {
        this.clearVisible()
        this.setState({
            groupVisible: true,
            selected: 2
        });
    }

    _computerNodeClicked() {
        this.clearVisible()
        this.setState({
            computerVisible: true,
            selected: 2
        });
    }

    _domainNodeClicked() {
        this.clearVisible()
        this.setState({
            domainVisible: true,
            selected: 2
        });
    }

    _gpoNodeClicked() {
        this.clearVisible()
        this.setState({
            gpoVisible: true,
            selected: 2
        });
    }

    _ouNodeClicked() {
        this.clearVisible()
        this.setState({
            ouVisible: true,
            selected: 2
        });
    }

    _caNodeClicked() {
        this.clearVisible()
        this.setState({
            caVisible: true,
            selected: 2
        });
    }

    _templateNodeClicked() {
        this.clearVisible()
        this.setState({
            templateVisible: true,
            selected: 2
        });
    }

    _azGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azGroupVisible: true,
            selected: 2
        });
    }

    _azUserNodeClicked() {
        this.clearVisible()
        this.setState({
            azUserVisible: true,
            selected: 2
        });
    }

    _azKeyVaultNodeClicked() {
        this.clearVisible()
        this.setState({
            azKeyVaultVisible: true,
            selected: 2
        });
    }

    _azResourceGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azResourceGroupVisible: true,
            selected: 2
        });
    }

    _azManagementGroupNodeClicked() {
        this.clearVisible()
        this.setState({
            azManagementGroupVisible: true,
            selected: 2
        });
    }

    _azRoleNodeClicked() {
        this.clearVisible()
        this.setState({
            azRoleVisible: true,
            selected: 2
        });
    }

    _azDeviceNodeClicked() {
        this.clearVisible()
        this.setState({
            azDeviceVisible: true,
            selected: 2
        });
    }

    _azSubscriptionNodeClicked() {
        this.clearVisible()
        this.setState({
            azSubscriptionVisible: true,
            selected: 2
        });
    }

    _azTenantNodeClicked() {
        this.clearVisible()
        this.setState({
            azTenantVisible: true,
            selected: 2
        });
    }

    _azVMNodeClicked() {
        this.clearVisible()
        this.setState({
            azVMVisible: true,
            selected: 2
        });
    }

    _azServicePrincipalNodeClicked() {
        this.clearVisible()
        this.setState({
            azServicePrincipalVisible: true,
            selected: 2
        });
    }

    _azAppNodeClicked() {
        this.clearVisible()
        this.setState({
            azAppVisible: true,
            selected: 2
        });
    }

    _ipauserNodeClicked() {
        this.clearVisible()
        this.setState({
            ipauserVisible: true,
            selected: 2
        });
    }

    _ipagroupNodeClicked() {
        this.clearVisible()
        this.setState({
            ipagroupVisible: true,
            selected: 2
        });
    }

    _ipacomputerNodeClicked() {
        this.clearVisible()
        this.setState({
            ipacomputerVisible: true,
            selected: 2
        });
    }

    _ipadomainNodeClicked() {
        this.clearVisible()
        this.setState({
            ipadomainVisible: true,
            selected: 2
        });
    }

    _ipaServiceClicked() {
        this.clearVisible()
        this.setState({
            ipaserviceVisible: true,
            selected: 2
        });
    }

    _ipacaNodeClicked() {
        this.clearVisible()
        this.setState({
            ipacaVisible: true,
            selected: 2
        });
    }

    _ipatemplateNodeClicked() {
        this.clearVisible()
        this.setState({
            ipatemplateVisible: true,
            selected: 2
        });
    }

    _ipaPermissionNodeClicked() {
        this.clearVisible()
        this.setState({
            ipapermissionVisible: true,
            selected: 2
        });
    }

    _ipaRoleNodeClicked() {
        this.clearVisible()
        this.setState({
            iparoleVisible: true,
            selected: 2
        });
    }

    _ipaSeLinuxNodeClicked() {
        this.clearVisible()
        this.setState({
            ipaselinuxVisible: true,
            selected: 2
        });
    }

    _cansudoEdgeClicked() {
        this.clearVisible()
        this.setState({
            ipacansudoVisible: true,
            selected: 2
        });
    }

    _handleSelect(index, last) {
        this.setState({ selected: index });
    }
    render() {
        return (
            <div>
                <Tabs
                    id='tabcontainer'
                    bsStyle='pills'
                    activeKey={this.state.selected}
                    onSelect={this._handleSelect.bind(this)}
                    className={styles.tc}
                >
                    <Tab eventKey={1} title='Database Info'>
                        <DatabaseDataDisplay />
                    </Tab>

                    <Tab eventKey={2} title='Node Info'>
                        <NoNodeData
                            visible={
                                !this.state.baseVisible &&
                                !this.state.containerVisible &&
                                !this.state.userVisible &&
                                !this.state.computerVisible &&
                                !this.state.groupVisible &&
                                !this.state.domainVisible &&
                                !this.state.gpoVisible &&
                                !this.state.ouVisible &&
                                !this.state.caVisible &&
                                !this.state.templateVisible &&
                                !this.state.azGroupVisible &&
                                !this.state.azUserVisible &&
                                !this.state.azKeyVaultVisible &&
                                !this.state.azResourceGroupVisible &&
                                !this.state.azDeviceVisible &&
                                !this.state.azSubscriptionVisible &&
                                !this.state.azTenantVisible &&
                                !this.state.azVMVisible &&
                                !this.state.azServicePrincipalVisible &&
                                !this.state.azAppVisible &&
                                !this.state.baseVisible &&
                                !this.state.azManagementGroupVisible &&
                                !this.state.azRoleVisible &&
                                !this.state.ipapermissionVisible &&
                                !this.state.iparoleVisible &&
                                !this.state.ipaselinuxVisible &&
                                !this.state.ipadomainVisible &&
                                !this.state.ipauserVisible &&
                                !this.state.ipagroupVisible &&
                                !this.state.ipaserviceVisible &&
                                !this.state.ipacomputerVisible &&
                                !this.state.ipacaVisible &&
                                !this.state.ipatemplateVisible &&
                                !this.state.ipacansudoVisible
                            }
                        />
                        <BaseNodeData visible={this.state.baseVisible} />
                        <UserNodeData visible={this.state.userVisible} />
                        <GroupNodeData visible={this.state.groupVisible} />
                        <ComputerNodeData
                            visible={this.state.computerVisible}
                        />
                        <DomainNodeData visible={this.state.domainVisible} />
                        <GpoNodeData visible={this.state.gpoVisible} />
                        <OuNodeData visible={this.state.ouVisible} />
                        <CaNodeData visible={this.state.caVisible} />
                        <TemplateNodeData visible={this.state.templateVisible} />
                        <ContainerNodeData visible={this.state.containerVisible} />
                        <AZGroupNodeData visible={this.state.azGroupVisible} />
                        <AZUserNodeData visible={this.state.azUserVisible} />
                        <AZKeyVaultNodeData
                            visible={this.state.azKeyVaultVisible}
                        />
                        <AZResourceGroupNodeData
                            visible={this.state.azResourceGroupVisible}
                        />
                        <AZDeviceNodeData
                            visible={this.state.azDeviceVisible}
                        />
                        <AZSubscriptionNodeData
                            visible={this.state.azSubscriptionVisible}
                        />
                        <AZTenantNodeData
                            visible={this.state.azTenantVisible}
                        />
                        <AZVMNodeData visible={this.state.azVMVisible} />
                        <AZServicePrincipalNodeData
                            visible={this.state.azServicePrincipalVisible}
                        />
                        <AZAppNodeData visible={this.state.azAppVisible} />
                        <AZManagementGroupNodeData visible={this.state.azManagementGroupVisible} />
                        <AZRoleNodeData visible={this.state.azRoleVisible} />
                        <IPAPermissionNodeData visible={this.state.ipapermissionVisible} />
                        <IPARoleNodeData visible={this.state.iparoleVisible} />
                        <IPASELinuxNodeData visible={this.state.ipaselinuxVisible} />
                        <IPADomainNodeData visible={this.state.ipadomainVisible} />
                        <IPAUserNodeData visible={this.state.ipauserVisible} />
                        <IPAComputerNodeData visible={this.state.ipacomputerVisible} />
                        <IPAGroupNodeData visible={this.state.ipagroupVisible} />
                        <IPAServiceNodeData visible={this.state.ipaserviceVisible} />
                        <IPACANodeData visible={this.state.ipacaVisible} />
                        <IPATemplateNodeData visible={this.state.ipatemplateVisible} />
                        <IPACanSUDOEdgeData visible={this.state.ipacansudoVisible} />
                    </Tab>

                    <Tab eventKey={3} title='Analysis'>
                        <PrebuiltQueriesDisplay />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withAlert()(TabContainer);
