import { Metadata } from 'next';
import ModelPageClient from './ModelPageClient';

interface PageProps {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ModelPage(props: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    props.params,
    props.searchParams
  ]);
  
  return <ModelPageClient 
    params={resolvedParams} 
    searchParams={resolvedSearchParams} 
  />;
}
