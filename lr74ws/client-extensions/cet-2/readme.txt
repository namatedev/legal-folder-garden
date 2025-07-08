cd C:\nmt\250708JSTMICJURIS\lr74ws\client-extensions\cet-2

..\..\gradlew build

oc cp dist/cet-2.zip lr-ce-743-7dbf6f848d-vt5x5:/opt/liferay/osgi/client-extensions
oc logs -f --tail=10 lr-ce-743-7dbf6f848d-vt5x5