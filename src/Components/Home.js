import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Input, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { languages } from "../constants/languages";
import webrtcDataActions from '../store/actions/webrtcAction'
import './Home.css';
import { userProfile } from "../constants/userProfile";

const { Option } = Select;

// const mapStateToProps = (state) => {
//     return {
//         profileId: state?.webrtcReducer?.profileId
//     }
// };

const mapDispatchToProps = {
    // fetchUserProfileId: webrtcDataActions.fetchUserProfileId,
    fetchLanguageCode: webrtcDataActions.fetchLanguageCode
}

const HomePageBase = (props) => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const [profileId, setProfileId] = useState('');

    const { fetchLanguageCode } = props;

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        () => {
            socket.emit("room:join", { email, room, profileId });
        },
        [email, room, socket, profileId]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { profileId } = data;
            if (profileId) {
                profileId === 1 ? navigate(`/hostRoom/${profileId}`) : navigate(`/ListenerRoom/${profileId}`)
            }
        },
        [navigate]
    );

    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    const onChangeLanguage = (value) => {
        fetchLanguageCode(value)
    }

    const onChangeProfileId = (value) => {
        setProfileId(value)
    }
    
    return (
        <div className="container">
            <h1>Welcome to My Translation Web Page</h1>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}

                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmitForm}
                autoComplete="off"
            >
                <Row>
                    <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Email ID"
                                name="email"
                                rules={[{ required: true, message: 'Please Enter Email ID' },
                                ]}
                            >
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder='Please Enter Email ID'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Room Number"
                                name="room"
                                rules={[{ required: true, message: 'Please Enter Room Number' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    id="room"
                                    placeholder='Please Enter Room Number'
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Profile ID"
                                name="profile"
                                rules={[{ required: true, message: 'Please Selec Profile' },
                                ]}
                            >
                                <Select value={profileId} onChange={onChangeProfileId} id="profile" placeholder='Please Select Profile'>
                                    {userProfile?.map(item => <Option key={item?.id} value={item?.id} >{item?.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Language"
                                name="language"
                                rules={[{ required: true, message: 'Please Select Target Language' },
                                ]}
                            >
                                <Select  onChange={onChangeLanguage} id="language" placeholder='Please Select Target Language'>
                                    {languages.map(item => <Option key={item.id} value={item.code} >{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Join
                                </Button>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const HomePage = connect(null, mapDispatchToProps)(HomePageBase);
export default HomePage;