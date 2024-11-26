import { Client } from '@elastic/elasticsearch'

const client = new Client({
    node: 'https://100.117.179.114:9200',
    auth: {
      username: 'elastic',
      password: 'DNFKH4RpID8jwn6GRshr'
    },
    caFingerprint: '771ff7fce3599f609eb6ea4f54a3615f2276d136aec65750fd1fe6f0772e8437',
    tls: {
      // might be required if it's a self-signed certificate
      rejectUnauthorized: false
    }
  })

export async function getLocationStats()  {
    
  const result= await client.search<Document>({
    index: 'game_updates',
    query: JSON.parse(`
        {
            "size": 0,
            "query": {
                "bool": {
                "filter": [
                    {
                    "range": {
                        "epoch": {
                        "gte": 7800
                        }
                    }
                    }
                ]
                }
            },
            "aggs": {
                "filtered_agents": {
                "filter": {
                    "bool": {
                    "should": [
                        { "term": { "state": "infected" } },
                        { "term": { "state": "infectious" } }
                    ]
                    }
                },
                "aggs": {
                    "unique_agents_count": {
                    "cardinality": {
                        "field": "agent_id"
                    }
                    }
                }
                }
            }
        }    
    `)
  })

  console.log(result.aggregations?.filtered_agents)

  return result.aggregations?.filtered_agents
}