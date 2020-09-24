import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { connect } from 'react-redux';

export const Sidebar = [
  {
    title: 'Rules overview',
    path: '/overview',
    icon: <AiIcons.AiFillBook />,
    cName: 'nav-text'
  },
  {
    title: 'Rules history',
    path: '/processedentities',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Topics',
    path: '/topics',
    icon: <FaIcons.FaNewspaper />,
    cName: 'nav-text'
  },
  {
    title: 'Maps',
    path: '/maps',
    icon: <IoIcons.IoMdMap />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Entities',
  //   path: '/',
  //   icon: <FaIcons.FaObjectGroup />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Cameras',
    path: '/cameras',
    icon: <FaIcons.FaCameraRetro />,
    cName: 'nav-text'
  }
]

const mapStateToProps = (state) => ({

});

// export default connect(mapStateToProps)(Sidebar);
