cd C:\nmt\250708JSTMICJURIS\lr74ws\client-extensions\lr-250708-cet
..\..\gradlew build

# DEV
oc login -u=kubeadmin -p=TCZTf-CoCow-gv78a-LiDiq --server=https://api.ocp4.namategroup.com:6443 --namespace=security

#
oc cp dist/lr-250708-cet.zip lr-ce-743-7dbf6f848d-vt5x5:/opt/liferay/osgi/client-extensions

oc logs -f --tail=10 lr-ce-743-7dbf6f848d-vt5x5

oc rsh lr-ce-743-7dbf6f848d-vt5x5

yarn add @clayui/drop-down
yarn add @clayui/icon
yarn add @clayui/button
yarn add @clayui/css
yarn add @clayui/provider
yarn add @clayui/core
yarn add @clayui/alert

// npm install @mui/material @mui/x-data-grid
yarn add @mui/material @mui/x-data-grid

yarn add @emotion/react @emotion/styled

// test
yarn add @mui/material @mui/x-data-grid-generator
// yarn add @mui/icons-material