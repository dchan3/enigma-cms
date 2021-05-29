import { cloneElement, isValidElement } from 'preact'; /** @jsx h **/
import { useState, useEffect } from 'preact/hooks';
import React from 'preact/compat';
import useTheRouterContext from '../hooks/useTheRouterContext';
import matchThePath from '../../lib/utils/match_the_path';

export default function TheSwitch({ location: pLoc, children }) {
  let context = useTheRouterContext(), [switchLocation, setSwitchLocation] =
    useState(pLoc || context.location), { basename } =
    context, element, match;

  useEffect(function() {
    setSwitchLocation(context.location);
  }, [context.location]);

  React.Children.forEach(children.length ? children : [children], (child) => {
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
