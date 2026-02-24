"use client";

import { Client } from "@/lib/types";
import { SellerDetail } from "@/lib/sellers";
import Modal from "@/app/components/ui/Modal";
import SellerDetailPanel from "./SellerDetailPanel";

interface Props {
  seller: SellerDetail;
  onClose: () => void;
  onClientClick: (client: Client) => void;
}

export default function SellerModal({ seller, onClose, onClientClick }: Props) {
  return (
    <Modal
      onClose={onClose}
      title={seller.seller}
      subtitle={`${seller.total} reuniones`}
      maxWidth="max-w-lg"
    >
      <SellerDetailPanel seller={seller} onClientClick={onClientClick} />
    </Modal>
  );
}
