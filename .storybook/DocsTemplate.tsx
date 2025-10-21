import * as React from 'react';
import { Controls, Markdown, Primary, Stories, Subtitle, Title } from '@storybook/blocks';
import apiGuidelines from '../guides/api-guidelines.md?raw';

const DocsTemplate: React.FC = () => (
  <>
    <Title />
    <Subtitle />
    <Primary />
    <Controls />
    <Stories />
    <Markdown>{apiGuidelines}</Markdown>
  </>
);

export default DocsTemplate;
