import React from 'react';

const NameTag = ({name}) => {
    return (
        <div className="nametag">
            <div className="nametag-content">
                <div className="nametag-content__header">
                    <h1 className="label-heading label-heading--1">Hello</h1>
                    <h2 className="label-heading label-heading--2">my name is</h2>
                </div>
                <div className="nametag-content__body">
                    <p className="name-text name-text--dark">{name}</p>
                </div>
                <div className="nametag-content__footer">
                    &nbsp;
                </div>
            </div>
        </div>
    )
}

export default NameTag;