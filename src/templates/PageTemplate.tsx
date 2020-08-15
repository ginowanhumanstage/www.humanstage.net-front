import React from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import gql from 'graphql-tag';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageContent from '../components/pageContent';
import withPreview from '../components/withPreview';

const PageTemplate = ({ data }) => {
  return (
    <Layout>
      <SEO title={data.wpPage.title} />
      <Headline>{data.wpPage.title}</Headline>
      <PageContent data={data.wpPage} />
    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
    wpPage(id: { eq: $id }) {
      title
      content
    }
  }
`;

const PREVIEW_QUERY = gql`
  query getPreview($id: Int!) {
    postBy(postId: $id) {
      title
      revisions {
        nodes {
          id
          title
          content
        }
      }
    }
  }
`;

const Headline = styled.h1`
  text-align: center;
  font-size: 1.4rem;
  font-weight: 400;
  font-feature-settings: 'palt';

  @media (min-width: 768px) {
    font-size: 1.7rem;
  }
`;

export default withPreview({ preview: PREVIEW_QUERY })(PageTemplate);
