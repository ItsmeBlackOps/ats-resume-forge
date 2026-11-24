# JD Signal Universe (250 phrases)

The full set of regex patterns the resume-tailor skill uses to detect JD asks. Each row: `phrase` (verbatim form to surface in resume) · `tag` (category bucket) · `regex` (synonym matcher, case-insensitive).

When porting this to a script, store as a JS/Python list of tuples or as `lib/jd-signals.json`.

## Languages (`lang`)
| Phrase | Regex |
|---|---|
| Python | `\bpython\b` |
| Go | `\b(go(lang)?)\b` |
| Java | `\bjava(?!\s*script)\b` |
| C++ | `\bc\+\+` |
| TypeScript | `\btype\s*script\b` |
| JavaScript | `\bjava\s*script\b` |
| SQL | `\bsql\b` |
| Bash / Shell | `\b(bash\|shell\s*scripting)\b` |
| Rust | `\brust\b` |
| Kotlin | `\bkotlin\b` |
| Scala | `\bscala\b` |
| Ruby | `\bruby\b` |
| Swift | `\bswift\b` |
| PHP | `\bphp\b` |
| Elixir | `\belixir\b` |

## Backend & APIs (`backend`)
| Phrase | Regex |
|---|---|
| Spring Boot | `\bspring\s*boot\b` |
| FastAPI | `\bfast\s*api\b` |
| Django | `\bdjango\b` |
| Node.js | `\bnode\.?\s*js\b` |
| Flask | `\bflask\b` |
| gRPC | `\bgrpc\b` |
| GraphQL | `\bgraph\s*ql\b` |
| REST APIs | `\brest\b` |
| WebSockets | `\bweb\s*sockets?\b` |
| microservices | `\bmicro\s*services?\b` |
| distributed systems | `\bdistributed\s+systems?\b` |
| event-driven | `\bevent[-\s]driven\b` |
| idempotency | `\bidempoten(t\|cy)\b` |
| saga / orchestration | `\b(saga\|orchestrat(ion\|or))\b` |
| rate limiting | `\brate[-\s]limit` |
| caching | `\b(cach(ing\|e\s*invalidation))\b` |
| horizontal scaling | `\bhorizontal\s*scaling\b` |
| high throughput | `\b(high[-\s]throughput\|throughput)\b` |
| low latency | `\blow[-\s]latency\b` |
| zero-downtime | `\bzero[-\s]downtime\b` |

## GenAI / ML (`ai`)
| Phrase | Regex |
|---|---|
| LangChain | `\blang\s*chain\b` |
| OpenAI / GPT-4 | `\b(open\s*ai\|gpt[-\s]?4)\b` |
| Anthropic Claude | `\b(anthropic\|claude)\b` |
| AWS Bedrock | `\bbedrock\b` |
| RAG | `\b(rag\|retrieval[-\s]augmented)\b` |
| pgvector | `\bpgvector\b` |
| FAISS | `\bfaiss\b` |
| embeddings | `\bembedding` |
| fine-tuning | `\bfine[-\s]tun` |
| LLMs | `\b(llm\|large language model)` |
| agents / multi-agent | `\b(agent\|multi[-\s]agent\|tool[-\s]?call)` |
| ML infrastructure | `\bml[-\s]?(adjacent\|infra\|infrastructure\|ops\|platform)\b` |
| LLMOps | `\bllm\s*ops\b` |

## ML specifics (`ml`)
| Phrase | Regex |
|---|---|
| PyTorch | `\bpytorch\b` |
| TensorFlow | `\btensorflow\b` |
| model training | `\bmodel[-\s]training\b` |
| model serving | `\bmodel[-\s]serving\b` |
| MLOps | `\bml\s*ops\b` |
| feature engineering | `\bfeature[-\s]engineering\b` |
| ranking / recommendation | `\b(rank(er\|ing)\|recommend(er\|ation))\b` |

## Data & Streaming (`data`)
| Phrase | Regex |
|---|---|
| PostgreSQL | `\b(postgres(ql)?)\b` |
| MySQL | `\bmysql\b` |
| MongoDB | `\bmongo\s*db\b` |
| Redis | `\bredis\b` |
| Memcached | `\bmemcached\b` |
| Elasticsearch | `\belastic\s*search\b` |
| Kafka | `\bkafka\b` |
| RabbitMQ | `\brabbit\s*mq\b` |
| Snowflake | `\bsnowflake\b` |
| Spark | `\bspark\b` |
| Airflow | `\bairflow\b` |
| Kinesis | `\bkinesis\b` |
| streaming | `\bstreaming\b` |
| data pipelines | `\bdata\s*pipelines?\b` |
| data platform | `\bdata[-\s]platform\b` |
| lakehouse | `\blake\s*house\b` |
| Zookeeper | `\bzoo[-\s]?keeper\b` |
| Flink | `\bflink\b` |
| Pulsar | `\bpulsar\b` |
| dbt | `\bdbt\b` |
| Cassandra | `\bcassandra\b` |
| DynamoDB | `\bdynamo\s*db\b` |
| Databricks | `\bdatabricks\b` |
| BigQuery | `\bbig\s*query\b` |
| Iceberg | `\biceberg\b` |
| Delta Lake | `\bdelta[-\s]lake\b` |
| Hudi | `\bhudi\b` |
| Parquet | `\bparquet\b` |
| Avro | `\bavro\b` |
| ETL / ELT | `\b(etl\|elt)\b` |
| CDC | `\b(cdc\|change[-\s]data[-\s]capture\|debezium)\b` |
| Redshift | `\bredshift\b` |
| ClickHouse | `\bclickhouse\b` |
| Aurora | `\baurora\b` |
| CockroachDB | `\bcockroach\s*db\b` |
| Spanner | `\bspanner\b` |

## Cloud & Infra (`cloud`)
| Phrase | Regex |
|---|---|
| AWS | `\baws\b` |
| EKS | `\beks\b` |
| Lambda | `\blambda\b` |
| S3 | `\bs3\b` |
| RDS | `\brds\b` |
| GCP | `\b(gcp\|google\s*cloud)\b` |
| Azure | `\bazure\b` |
| Docker | `\bdocker\b` |
| Kubernetes | `\b(kubernetes\|k8s)\b` |
| Terraform | `\bterraform\b` |
| Helm | `\bhelm\b` |
| ArgoCD | `\bargo\s*cd\b` |
| Istio / service mesh | `\b(istio\|service[-\s]mesh\|envoy)\b` |
| Consul | `\bconsul\b` |
| Kustomize | `\bkustomize\b` |
| Pulumi | `\bpulumi\b` |
| Cloudflare | `\bcloudflare\b` |
| CDN | `\bcdn\b` |
| Edge functions | `\b(edge\s*functions?\|workers?)\b` |

## CI/CD & Tooling (`cicd`)
| Phrase | Regex |
|---|---|
| CI/CD pipelines | `\bci[\/\s]?cd\b` |
| GitHub Actions | `\bgithub\s*actions\b` |
| Jenkins | `\bjenkins\b` |
| CircleCI | `\bcircle\s*ci\b` |
| Buildkite | `\bbuildkite\b` |
| Bitbucket Pipelines | `\bbitbucket\s*pipelines?\b` |
| Fastlane | `\bfastlane\b` |
| Spinnaker | `\bspinnaker\b` |

## Observability (`obs`)
| Phrase | Regex |
|---|---|
| Datadog | `\bdata\s*dog\b` |
| Prometheus | `\bprometheus\b` |
| Grafana | `\bgrafana\b` |
| OpenTelemetry | `\bopen\s*telemetry\b` |
| observability | `\bobservab` |
| SLOs | `\bslos?\b` |

## Performance & SRE (`perf`)
| Phrase | Regex |
|---|---|
| p99 tail latency | `\b(p99\|p999\|tail\s*latency\|latency\s*sli)\b` |
| error budgets | `\b(error\s*budget\|burn\s*rate)\b` |
| SLI / SLO | `\b(sli\|slo)\b` |
| profiling | `\b(profil(ing\|er)\|flamegraph\|pprof\|perf\s*tools)\b` |
| load testing | `\b(load[-\s]test\|k6\|locust\|wrk\|jmeter)\b` |
| capacity planning | `\bcapacity[-\s]planning\b` |

## Frontend (`frontend`)
| Phrase | Regex |
|---|---|
| React | `\breact(?!\s*native)\b` |
| Next.js | `\bnext\.?\s*js\b` |
| Tailwind CSS | `\btailwind\b` |
| Redux | `\bredux\b` |
| WCAG / accessibility | `\b(wcag\|accessibility\|a11y)\b` |
| Vue | `\bvue\.?js\b` |
| Angular | `\bangular\b` |
| Svelte | `\bsvelte\b` |
| Flutter | `\bflutter\b` |
| React Native | `\breact[-\s]native\b` |
| iOS | `\bios\b` |
| Android | `\bandroid\b` |
| Swift | `\bswift\b` |
| SwiftUI | `\bswift\s*ui\b` |
| UIKit | `\buikit\b` |

## Security & Compliance (`sec`)
| Phrase | Regex |
|---|---|
| OAuth2 / OIDC | `\b(oauth\|oidc)\b` |
| JWT | `\bjwt\b` |
| HashiCorp Vault | `\bvault\b` |
| SOC 2 | `\bsoc[-\s]?2\b` |
| HIPAA | `\bhipaa\b` |
| PCI | `\bpci\b` |
| GDPR | `\bgdpr\b` |
| zero-trust | `\bzero[-\s]trust\b` |
| IAM least privilege | `\b(iam\|least[-\s]privilege)\b` |
| secrets management | `\bsecrets?[-\s]management\b` |
| data classification | `\bdata[-\s]classification\b` |

## Testing (`test`)
| Phrase | Regex |
|---|---|
| pytest | `\bpytest\b` |
| JUnit | `\bjunit\b` |
| GoogleTest | `\b(gtest\|googletest)\b` |
| Jest | `\bjest\b` |
| Playwright | `\bplaywright\b` |
| Cypress | `\bcypress\b` |
| TDD | `\btdd\b` |

## Methodology & Collaboration (`meth`)
| Phrase | Regex |
|---|---|
| Agile / Scrum | `\b(agile\|scrum\|sprint\|kanban\|standup\|retrospective)\b` |
| code review | `\bcode[-\s]review\b` |
| mentorship | `\b(mentor\|mentorship)\b` |
| design docs / RFCs | `\b(design\s*docs?\|rfcs?\|architecture\s*review)\b` |
| cross-functional partnership | `\bcross[-\s]functional\b` |
| stakeholder management | `\bstakeholder\b` |
| ownership | `\bownership\b` |
| on-call / oncall | `\b(on[-\s]call\|oncall)\b` |

## Feature platform / experimentation (`featplat`)
| Phrase | Regex |
|---|---|
| feature flags | `\bfeature[-\s]flags?\b` |
| A/B testing | `\b(a\/b\s*test\|experimentation)\b` |
| rollouts | `\b(canary\|progressive\s*rollout\|blue[-\s]green)\b` |
| feature platform | `\bfeature\s*platform\b` |

## Telecom / IoT (niche) (`telecom`)
| Phrase | Regex |
|---|---|
| 5G / telecom | `\b(5g\|telecom\|carrier\|signaling\|gtp\|sctp\|3gpp\|diameter)\b` |
| IoT / edge | `\b(iot\|edge\|telematics\|connected[-\s]vehicle)\b` |

## OS / Platform misc (`os`)
| Phrase | Regex |
|---|---|
| Linux | `\blinux\b` |
| POSIX | `\bposix\b` |
| gVisor / sandboxing | `\b(gvisor\|firecracker\|sandbox)\b` |

---

## How the universe is used

1. Concatenate JD full text + snippet + title + company → lowercase.
2. Run each regex; collect hits as `{phrase, tag}`.
3. Pass hits + tagsHit set to:
   - **Skills builder**, show categories where any signal hit, anchor with candidate-core items
   - **Bullet picker**, score each bullet by # of overlapping tags, take top 7 with category diversity
   - **Bridge bullet**, collect 🟡 partials, output as "Bridge to JD asks" if ≥ 2

## Adjacent-skill (🟡) defaults

These map adjacent skills to the candidate's real-experience bridge context. Override per candidate based on their actual stack.

| If JD asks | And candidate has | Mark as | Bridge context |
|---|---|---|---|
| Kotlin | Java + Spring Boot in prod | 🟡 | "shipped Spring Boot at scale, JVM/Kotlin migration is a 2-week ramp" |
| Scala | Java + functional patterns | 🟡 | "partnered with JVM teams; can drop into Akka / Cats-Effect with one sprint of ramp" |
| Swift / SwiftUI / UIKit | React + TypeScript in prod | 🟡 | "MVVM patterns from React translate; iOS Swift ramp ≈ 2 sprints" |
| Vue / Angular / Svelte | React + Redux | 🟡 | "React/Redux experience translates 1:1" |
| Flutter / React Native | React + TS | 🟡 | "cross-platform UI thinking from React; Dart pickup in days" |
| Zookeeper | Kafka in production | 🟡 | "used as Kafka coordinator at high QPS, strong operational familiarity" |
| Flink | Kafka + Kinesis streaming | 🟡 | "streaming background; Flink stateful operators translate from windowing patterns" |
| Pulsar | Kafka pub/sub | 🟡 | "pub/sub architecture overlap with Kafka; tiered storage concepts familiar" |
| Cassandra / DynamoDB | Postgres + sharding | 🟡 | "wide-column / consistency-tuning analogues to Postgres + DynamoDB GSIs" |
| BigQuery | Snowflake | 🟡 | "same MPP mental model; slot-based billing translates" |
| Iceberg / Delta Lake / Hudi | Snowflake + Parquet | 🟡 | "snapshot/branching maps to git-style workflows" |
| dbt | Airflow + Spark | 🟡 | "model graphs follow same DAG discipline" |
| Databricks | Spark + Snowflake | 🟡 | "notebook → job pattern is a small ramp" |
| GCP | deep AWS | 🟡 | "primitives map: Cloud Run = Lambda, Spanner = Aurora multi-region" |
| Azure | deep AWS | 🟡 | "Azure AD + AKS map directly to IAM + EKS" |
| CircleCI / Buildkite | GitHub Actions + Jenkins | 🟡 | "YAML pipeline config translates 1:1" |
| Spinnaker | ArgoCD GitOps | 🟡 | "Argo Rollouts → Spinnaker pipelines is the same mental model" |
| Pulumi | Terraform deep | 🟡 | "Pulumi TypeScript IaC is identical mental model" |
| Cloudflare | CloudFront + caching | 🟡 | "Workers ≈ Lambda@Edge, tiny ramp" |
| PyTorch / TensorFlow | LLM/RAG production work | 🟡 | "fine-tuning loops a 1-2 sprint ramp from Bedrock + LangChain background" |
| MLOps | LLMOps shipped | 🟡 | "Ragas + golden-set + per-model cost gates, model-lifecycle discipline transfers" |
| Istio / service mesh | gRPC mesh in prod | 🟡 | "Envoy sidecars a 1-week ramp" |

Anything not in this map AND not in the candidate's strong set defaults to 🔴 missing.
