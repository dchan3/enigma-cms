import { cloneElement, isValidElement } from 'preact'; /** @jsx h **/
import { useState, useEffect } from 'preact/hooks';
import React from 'preact/compat';
import useTheRouterContext from '../hooks/useTheRouterContext';
import matchThePath from '../../lib/utils/match_the_path';

export default function TheSwitch(props) {
  let context = useTheRouterContext();

  useEffect(function() {
    setSwitchLocation(context.location);
  }, [context.location])

  let [switchLocation, setSwitchLocation] =
    useState(props.location || context.location);
  let { basename } = context;

  let element, match;

  React.Children.forEach(props.children.length ? props.children : [props.children], (child) => {
    if (match == null && isValidElement(child)) {
      element = child;

      const path = child.props.path || child.props.from;

      match = path
        ? matchThePath(switchLocation.pathname.replace(basename, ''),
          { ...child.props, path }) : context.match;
    }
  });

  return match ? cloneElement(element, {
    switchLocation, computedMatch: match }) : null;
}
