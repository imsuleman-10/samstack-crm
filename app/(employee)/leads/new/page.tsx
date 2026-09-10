import type { Metadata } from 'next'
import { getBusinessCategories } from '@/lib/queries/leads'
import NewLeadClient from './new-lead-client'

export const metadata: Metadata = { title: 'Add Lead' }

export default async function NewLeadPage() {
  const categories = await getBusinessCategories()
  return <NewLeadClient categories={categories} />
}
