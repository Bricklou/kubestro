use std::sync::Arc;

use crate::utils::k8s_type_convert::{bool_from_str, bool_to_str};
use k8s_openapi::api::core::v1::ConfigMap;
use kube::{
    api::{ListParams, ObjectMeta},
    Api, Resource,
};
use kubestro_core_domain::ports::core_setup::{CoreSetup, CoreSetupError};
use serde::{Deserialize, Serialize};
use tracing::trace;

use super::k8s_client::K8sClient;

pub struct CoreSetupService {
    // K8S client
    client: Arc<K8sClient>,
}

impl CoreSetupService {
    pub fn new(client: Arc<K8sClient>) -> Self {
        Self { client }
    }
}

// Our own way of representing data - partially typed in 2 ways
// For a ConfigMap variant that only accept a specific format
#[derive(Default, Serialize, Deserialize, Debug, Clone)]
pub struct SetupConfigMapData {
    #[serde(deserialize_with = "bool_from_str", serialize_with = "bool_to_str")]
    installed: bool,
}

#[derive(Resource, Serialize, Deserialize, Debug, Clone)]
#[resource(inherit = ConfigMap)]
struct SetupConfigMap {
    metadata: ObjectMeta,
    data: SetupConfigMapData,
}

impl Default for SetupConfigMap {
    fn default() -> Self {
        Self {
            metadata: ObjectMeta {
                name: Some("kubestro-setup".to_string()),
                ..ConfigMap::default().metadata
            },
            data: SetupConfigMapData::default(),
        }
    }
}

#[async_trait::async_trait]
impl CoreSetup for CoreSetupService {
    async fn is_setup(&self) -> Result<bool, CoreSetupError> {
        let Some(config_map) = self.get_setup_config().await? else {
            return Ok(false);
        };

        if config_map.data.installed {
            return Ok(false);
        }

        Ok(true)
    }

    async fn setup(&self) -> Result<(), CoreSetupError> {
        // Create config map
        let cm = SetupConfigMap::default();

        trace!("Creating ConfigMap: {:?}", cm);

        let configmaps: Api<SetupConfigMap> = Api::default_namespaced(self.client.client());

        configmaps
            .create(&Default::default(), &cm)
            .await
            .map_err(|e| CoreSetupError::SetupError(e.to_string()))?;

        Ok(())
    }
}

impl CoreSetupService {
    async fn get_setup_config(&self) -> Result<Option<SetupConfigMap>, CoreSetupError> {
        // Access the ConfigMap API in the current namespace
        let configmaps: Api<SetupConfigMap> = Api::default_namespaced(self.client.client());

        // List ConfigMaps API in the current namespace
        let lp = ListParams::default().fields("metadata.name=kubestro-setup");
        let cm_list = configmaps
            .list(&lp)
            .await
            .map_err(|e| CoreSetupError::SetupError(e.to_string()))?;

        if cm_list.items.is_empty() {
            return Ok(None);
        }

        Ok(Some(cm_list.items[0].clone()))
    }
}
